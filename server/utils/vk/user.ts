import { VK } from "vk-io";
import { session } from '../../bot/middlewares';

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
  saveVenue,
  getVenue,
  saveDateList,
  getDateList,
  getMenagerId,
  getInstructorKey,
  getInstructorPeerId,
  getUserIdByPeerId,
  getUserOrgId,
  saveProgram,
  getUserSession,
  setUserSession,
  createNewUser,
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
  program?: string;
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

type Variant = {
  startTime: string;
  endTime: string;
};

type DateOption = {
  date: string;
  variants: Variant[];
};

type DateList = {
  lessonId: string;
  newOptions: DateOption[];
};

async function saveUserState(params: SaveUserStateParams) {
  const {
    peerId,
    state,
    city,
    citiesList,
    page,
    program,
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
  if (program !== undefined) {
    updateData.program = program;
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
      program: program ?? null,
      organization: organization ?? null,
      organizationsList: organizationsList ?? [],
    }
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
      role: null,
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
    cancellationLesson: false,
    changeInstructor: true,
  };
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


async function saveDateList(peerId: number, dateList: DateList) {
  return prisma.users.upsert({
    where: { peerId },
    update: {
      dateList: dateList,
    },
    create: {
      peerId,
      dateList: dateList ?? [],
    },
  });
}


async function getDateList(peerId: number) {
  const user = await prisma.users.findUnique({
    where: { peerId },
    select: { dateList: true },
  });

  const venueList = (user?.dateList ?? []) as DateList;

  return venueList;
}


async function getMenagerId() {
  const userData = await prisma.users.findFirst({
    where: { role: "MANAGER" },
    select: { peerId: true },
  });
  return userData?.peerId;
}


async function getInstructorKey(userId: number) {
  const user = await fakeApi.employee.findFirst({
    where: { id: userId },
    select: { accessCode: true },
  });

  return user?.accessCode;
}


async function getInstructorPeerId(key: string) {
  const user = await prisma.users.findFirst({
    where: { key: key },
    select: { peerId: true },
  });

  return user?.peerId || 0;
}


async function getUserIdByPeerId(peerId: number) {
  const user = await prisma.users.findFirst({
    where: { peerId: peerId },
    select: { id: true },
  });

  return user?.id;
}


async function getUserOrgId(peerId: number) {
  const userData = await prisma.users.findFirst({
    where: { peerId: peerId },
    select: { organization: true, city: true }
  });

  if (!userData?.city || !userData?.organization) {
    return null;
  }

  const city = await fakeApi.city.findFirst({
    where: { name: userData?.city },
    select: { id: true },
  });

  const orgId = await fakeApi.organization.findFirst({
    where: { name: userData.organization, cityId: city?.id },
    select: { id: true },
  });

  return orgId?.id;
}


async function saveProgram(peerId: number, program: string) {
  return await prisma.users.update({
    where: { peerId: peerId },
    data: {
      program: program,
    }
  });
}


async function getUserSession(peerId: number) {
  const storage: any = (session as any).storage;
  const sessionKey = String(peerId);
  const userSession =
    (await storage.get?.(sessionKey)) ??
    (await storage.read?.(sessionKey)) ??
    {};

  return userSession;
}

type SessionData = any;

async function setUserSession(peerId: number, sessionData: SessionData) {
  const storage: any = (session as any).storage;
  if (storage.set) {
    return storage.set(peerId, sessionData);
  }
  if (storage.write) {
    return storage.write(peerId, sessionData);
  }

  storage[peerId] = sessionData;
}


async function createNewUser(isChild: boolean, gender: string, name: string, surname: string, birthdate: string, phone: string, email: string, parentName?: string, parentSurname?: string) {
  const [dd, mm, yyyy] = birthdate.split('.');
  const date = new Date(Date.UTC(Number(yyyy), Number(mm) - 1, Number(dd), 0, 0, 0, 0));

  if (isChild) {
    await fakeApi.client.create({
      data: {
        firstName: name,
        lastName: surname,
        gender: gender === "male" ? "M" : "F",
        birthDate: date,
        phone: phone,
        email: email,
        firstNameParent: parentName,
        lastNameParent: parentSurname,
        accountType: "CHILD",
        status: "WAITING",
        accessCode: generateCode(),
      }
    });
  }
  else {
    await fakeApi.client.create({
      data: {
        firstName: name,
        lastName: surname,
        gender: gender === "male" ? "M" : "F",
        birthDate: date,
        phone: phone,
        email: email,
        accountType: "ADULT",
        status: "WAITING",
        accessCode: generateCode(),
      }
    });
  }
  return true;
}