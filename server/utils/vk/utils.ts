import { VK, Keyboard } from "vk-io";

export {
  findCities,
  findOrganizations,
  getPage,
  getCityOrganizationList,
  getListFromState,
  setPreviousState,
  createVenueList,
  findVenueDataFromName,
  deleteLastBotMessage,
  generateRandomId,
  getPeerIdList,
  saveNewMessage,
  deleteChangeInstructorMessage,
  deleteMessageFromDb,
  updateInstructor,
  getMessageId,
  checkAvailableInstructor,
  checkMessagesCount,
};

const fakeApi = useFakeAPI();
const prisma = usePrisma();
const vk = new VK({ token: useRuntimeConfig().vkToken });

type VenueIds = {
  venueId: number;
  lessonId: number;
};

type Instructor = {
  id: number
  isAvailable: boolean
}

function findCities(data: Record<string, string[]>, query: string) {
  const q = query.toLowerCase();

  return Object.keys(data).filter((city) => city.toLowerCase().includes(q));
}

function findOrganizations(data: Record<string, string[]>, query: string) {
  return data[query];
}

const MAX_PAGE_SIZE = 3;

function getPage(array: string[], page: number) {
  const totalPages = Math.max(1, Math.ceil(array.length / MAX_PAGE_SIZE));
  const currentPage = Math.min(Math.max(1, page), totalPages);

  const start = (currentPage - 1) * MAX_PAGE_SIZE;
  const end = start + MAX_PAGE_SIZE;
  const slice = array.slice(start, end);

  return { slice, currentPage, totalPages };
}

async function getCityOrganizationList() {
  const cities = await fakeApi.city.findMany({
    include: {
      organizations: true,
    },
  });

  const result = cities.reduce(
    (acc, city) => {
      acc[city.name] = city.organizations.map((org) => org.name);
      return acc;
    },
    {} as Record<string, string[]>,
  );

  return result;
}

async function getListFromState(peerId: number, state: string) {
  let list;

  switch (state) {
    case "choose_city":
      list = await getUserCityList(peerId);
      break;

    case "choose_organization":
      list = await getUserOrganizationsList(peerId);
      break;

    case "changeVenue":
      list = await createVenueList(peerId);
      break;
  }

  return list;
}

async function setPreviousState(peerId: number, state: string) {
  const keyboard = await buildInstructorKeyboard(peerId);
  switch (state) {
    case "choose_city":
      await sendChooseCityMessage(peerId);
      await saveUserState({ peerId: peerId, state: "choose_city" });
      break;

    case "choose_organization":
      await sendChooseCityMessage(peerId);
      await saveUserState({ peerId: peerId, state: "choose_city" });
      break;

    case "changeVenue":
      await sendScheduleMenagementMessage(peerId, keyboard, "Какой-то текст");
      await saveUserState({ peerId: peerId, state: "scheduleManagement" });
      break;

    case "changeDate":
      await sendScheduleMenagementMessage(peerId, keyboard, "Какой-то текст");
      await saveUserState({ peerId: peerId, state: "scheduleManagement" });
      break;
  }
}

async function createVenueList(peerId: number): Promise<string[]> {
  const venueList = await getVenue(peerId);
  const array = venueList.map((venue) => venue.venueName);
  return array;
}

async function findVenueDataFromName(peerId: number, name: string) {
  const venueList = await getVenue(peerId);

  const venue = venueList.find((v) => v.venueName === name);

  if (!venue) {
    return null;
  }

  const venueId = venue.venueId;
  const lessonId = venue.lessonId;

  return { venueId, lessonId };
}

async function deleteLastBotMessage(peerId: number, ownerGroupId: number) {
  const history = await vk.api.messages.getHistory({
    peer_id: peerId,
    count: 5,
  });

  const items = history.items || [];

  const lastBotMessage = items.find((msg) => msg.from_id === ownerGroupId);

  if (!lastBotMessage) {
    console.log("Сообщений бота не найдено");
  } else {
    const messageId = lastBotMessage.id;
    const cmid = lastBotMessage.conversation_message_id;

    await vk.api.messages.delete({
      message_ids: messageId,
      delete_for_all: 1,
    });
  }
}


function generateRandomId(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}


async function getPeerIdList(instructorsList: Instructor[]) {
  const peerIdList = await Promise.all(
    instructorsList.map(async (instructor) => {
      if (!instructor.isAvailable) {
        return 0;
      }

      const key = await getInstructorKey(instructor.id);
      const peerId = await getInstructorPeerId(key!);


      return peerId;
    })
  )

  return peerIdList
}


async function saveNewMessage(userId: number, messageId: number, randomId: number) {
  return prisma.messages.create({
    data: {
      userId: userId,
      messageId: messageId,
      randomId: randomId,
    }
  });
}


async function deleteMessageFromDb(messageId: number) {
  const message = await prisma.messages.findFirst({
    where: { messageId: messageId },
    select: { id: true },
  });

  return await prisma.messages.delete({
    where: { id: message?.id },
  });
}


async function deleteChangeInstructorMessage(peerId: number, randomId: number) {
  const ownerId = await getUserIdByPeerId(peerId);

  const messages = await prisma.messages.findMany({
    where: { randomId: randomId },
    select: { userId: true, messageId: true },
  });

  for (const message of messages) {
    if (message.userId === ownerId) {
      await editMessage(peerId, message.messageId, "Вы согласились");
    }
    else {
      await deleteMessage(message.messageId);
    }

    await deleteMessageFromDb(message.messageId);
  }
}


async function updateInstructor(lessonId: number, peerId: number) {
  const id = await getUserIdByPeerId(peerId);

  return await fakeApi.lesson.update({
    where: { id: Number(lessonId) },
    data: {
      instructorId: Number(id),
    }
  });
}


async function getMessageId(userId: number, randomId: number) {
  const data = await prisma.messages.findFirst({
    where: { userId: userId, randomId: randomId },
    select: { messageId: true },
  });

  return data?.messageId || 0;
}


function checkAvailableInstructor(instructorsList: Instructor[]) {
  let isAvailable = false;

  for (const instructor of instructorsList) {
    if (instructor.isAvailable) {
      isAvailable = true;
      return isAvailable;
    }
  }

  return isAvailable;
}


async function checkMessagesCount(randomId: number) {
  const count = await prisma.messages.count({
    where: { randomId },
  });

  return count;
}