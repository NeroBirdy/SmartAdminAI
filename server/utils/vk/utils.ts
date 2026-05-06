import { VK, Keyboard } from "vk-io";

export {
  findCities,
  findOrganizations,
  getPage,
  getCityOrganizationList,
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
  getPrograms,
  getListTitle,
  isValidDate,
  isValidPhone,
  isValidEmail,
  generateCode,
  timeFromIsoToLocalHm,
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

    case "choose_program":
      await sendChooseOrganizationKeyboard(peerId);
      await saveUserState({ peerId: peerId, state: "choose_organization" });
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

type Venue = {
  lessonId: number,
  venueId: number,
  venueName: string,
  isAvailable: boolean,
}

async function createVenueList(venueList: Venue[]): Promise<string[]> {
  return venueList
    .filter(v => v.isAvailable)
    .map(v => v.venueName);
}

async function findVenueDataFromName(venueList: Venue[], name: string) {
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


async function getPrograms(orgId: number) {
  const programs = await fakeApi.program.findMany({
    where: { organizationId: orgId },
    select: { name: true },
  });

  return programs.map((program) => {
    return program.name;
  });
}

function getListTitle(listKey: string): string {
  switch (listKey) {
    case 'city':
      return '📋 Выберите город:';
    case 'organization':
      return '📋 Выберите организацию:';
    case 'program':
      return '📋 Выберите программу:';
    default:
      return '📋 Выберите вариант:';
  }
}


function isValidDate(value: string): boolean {
    const regex = /^(\d{2})\.(\d{2})\.(\d{4})$/;
    const match = value.match(regex);
    if (!match) return false;
    const day = parseInt(match[1]!);
    const month = parseInt(match[2]!);
    const year = parseInt(match[3]!);
    if (month < 1 || month > 12) return false;
    if (day < 1 || day > 31) return false;
    if (year < 1900 || year > new Date().getFullYear()) return false;
    const date = new Date(year, month - 1, day);
    return (
        date.getFullYear() === year &&
        date.getMonth() === month - 1 &&
        date.getDate() === day
    );
}

function isValidPhone(value: string): boolean {
    const cleaned = value.replace(/[\s\-\(\)]/g, '');
    return /^(\+7|8|7)?9\d{9}$/.test(cleaned);
}

function isValidEmail(value: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function generateCode(length = 20): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';

  for (let i = 0; i < length; i++) {
    const index = Math.floor(Math.random() * chars.length);
    result += chars[index];
  }

  return result;
}

function timeFromIsoToLocalHm(iso: string): string {
  const date = new Date(iso);

  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  return `${hours}:${minutes}`;
}