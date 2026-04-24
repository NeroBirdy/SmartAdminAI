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
};

const fakeApi = useFakeAPI();
const vk = new VK({ token: useRuntimeConfig().vkToken });

type VenueIds = {
  venueId: number;
  lessonId: number;
};

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
      const keyboard = await buildInstructorKeyboard(peerId);

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
