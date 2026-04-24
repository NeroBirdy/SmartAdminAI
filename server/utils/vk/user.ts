import { VK, Keyboard } from "vk-io";

export {
  saveUserState,
  saveOrganizationList,
  getUserState,
  getUserCityList,
  getUserPage,
  getUserOrganizationsList,
  setUserAccessCode,
  getUserAccessCode,
  login,
  logout,
  getUserRole,
  getPermission,
  chooseCity,
  saveVenue,
  getVenue,
};

const vk = new VK({ token: useRuntimeConfig().vkToken });

const prisma = usePrisma();
const fakeApi = useFakeAPI();

type SaveUserStateParams = {
  peerId: number;
  state?: string | null;
  city?: string | null;
  citiesList?: unknown;
  page?: number;
  organization?: string;
  organizationsList?: unknown;
};

type dbVenue = {
  lessonId: number;
  venueId: number;
  venueName: string;
  isAvailable: boolean;
};

type dbVenueList = dbVenue[];

async function saveUserState(params: SaveUserStateParams) {
  const {
    peerId,
    state,
    city,
    citiesList,
    page,
    organization,
    organizationsList,
  } = params;

  const updateData: any = {};

  if (state !== undefined) {
    updateData.state = state;
  }
  if (city !== undefined) {
    updateData.city = city;
  }
  if (citiesList !== undefined) {
    updateData.citiesList = citiesList;
  }
  if (page !== undefined) {
    updateData.page = page;
  }
  if (organization !== undefined) {
    updateData.organization = organization;
  }
  if (organizationsList !== undefined) {
    updateData.organization = organizationsList;
  }

  return prisma.users.upsert({
    where: { peerId },
    update: updateData,
    create: {
      peerId,
      state: state ?? null,
      city: city ?? null,
      citiesList: citiesList ?? [],
      page: page ?? 1,
      organization: organization,
      organizationsList: organizationsList ?? [],
    },
  });
}

async function saveOrganizationList(city: string, peerId: number) {
  const response = await getCityOrganizationList();

  const organizationsList = findOrganizations(response, city);

  return prisma.users.upsert({
    where: { peerId },
    update: {
      organizationsList: organizationsList,
    },
    create: {
      peerId,
      organizationsList: organizationsList ?? [],
    },
  });
}

async function getUserState(peerId: number) {
  const user = await prisma.users.findUnique({
    where: { peerId },
    select: { state: true },
  });

  return user?.state || "";
}

async function getUserCityList(peerId: number): Promise<string[]> {
  const user = await prisma.users.findUnique({
    where: { peerId },
    select: { citiesList: true },
  });

  const list = user?.citiesList ?? [];

  return Array.isArray(list) ? (list as string[]) : [];
}

async function getUserPage(peerId: number) {
  const user = await prisma.users.findUnique({
    where: { peerId },
    select: { page: true },
  });

  return user?.page || 1;
}

async function getUserOrganizationsList(peerId: number): Promise<string[]> {
  const user = await prisma.users.findUnique({
    where: { peerId },
    select: { organizationsList: true },
  });

  const list = user?.organizationsList ?? [];

  return Array.isArray(list) ? (list as string[]) : [];
}

async function setUserAccessCode(
  peerId: number,
  accessCode: string,
  role: string,
) {
  return await prisma.users.update({
    where: { peerId },
    data: {
      key: accessCode,
      role: role,
    },
  });
}

async function getUserAccessCode(peerId: number) {
  const data = await prisma.users.findFirst({
    where: { peerId: peerId },
    select: { key: true },
  });
  return data?.key;
}

async function login(peerId: number, key: string) {
  try {
    const [client, employee] = await Promise.all([
      fakeApi.client.findUnique({
        where: { accessCode: key },
        select: { firstName: true, lastName: true },
      }),
      fakeApi.employee.findUnique({
        where: { accessCode: key },
        select: { firstName: true, lastName: true, role: true },
      }),
    ]);

    let user;
    let role;

    if (!client && !employee) {
      await vk.api.messages.send({
        peer_id: peerId,
        message: "Неверный код",
        random_id: Date.now(),
      });
      return false;
    } else if (client && !employee) {
      user = client;
      role = "CLIENT";
    } else if (!client && employee) {
      user = employee;
      role = employee.role;
    }

    setUserAccessCode(peerId, key, role!);
    sendCompleteLoginMessage(peerId, user!.firstName, user!.lastName);
  } catch (e) {
    console.log(e);
  }
  return true;
}

async function logout(peerId: number) {
  return await prisma.users.update({
    where: { peerId },
    data: {
      key: null,
    },
  });
}

async function getUserRole(peerId: number) {
  const userData = await prisma.users.findUnique({
    where: { peerId: peerId },
    select: { role: true },
  });
  return userData?.role;
}

async function getPermission(peerId: number) {
  return {
    changeDate: true,
    changeVenue: true,
    cancellationLesson: true,
    changeInstructor: true,
  };
}

async function chooseCity(peerId: number, cityList: string[]) {
  if (cityList!.length === 0) {
    await vk.api.messages.send({
      peer_id: peerId,
      message: "Город не найден, попробуйте еще раз",
      random_id: Math.floor(Math.random() * 1000000),
    });
  } else if (cityList!.length === 1) {
    await vk.api.messages.send({
      peer_id: peerId,
      message: `Ваш город: ${cityList![0]}`,
      random_id: Math.floor(Math.random() * 1000000),
    });
    await saveOrganizationList(cityList![0]!, peerId);
    await saveUserState({
      peerId: peerId,
      state: "choose_organization",
      city: cityList![0],
    });
    await sendChooseOrganizationKeyboard(peerId);
  } else {
    const keyboard = await buildKeyboard(peerId, 1, "choose_city");

    const msgId = await vk.api.messages.send({
      peer_id: peerId,
      message: "Выберите город:",
      keyboard,
      random_id: Date.now(),
    });

    await saveUserState({ peerId: peerId, citiesList: cityList, page: 1 });
  }

  return "ok";
}

async function saveVenue(peerId: number, venueList: dbVenueList) {
  return prisma.users.upsert({
    where: { peerId },
    update: {
      venueList: venueList,
    },
    create: {
      peerId,
      venueList: venueList ?? [],
    },
  });
}

async function getVenue(peerId: number): Promise<dbVenueList> {
  const user = await prisma.users.findUnique({
    where: { peerId },
    select: { venueList: true },
  });

  const venueList = (user?.venueList ?? []) as dbVenueList;

  return venueList;
}
