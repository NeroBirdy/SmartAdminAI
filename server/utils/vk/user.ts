import { VK } from "vk-io";
import { session } from '../../bot/middlewares';

export {
  saveUserState,
  getUserState,
  setUserAccessCode,
  getUserAccessCode,
  login,
  logout,
  getUserRole,
  getPermission,
  saveDateList,
  getMenagerId,
  getInstructorKey,
  getInstructorPeerId,
  getUserIdByPeerId,
  getUserOrgId,
  saveProgram,
  getUserSession,
  setUserSession,
  createNewUser,
  checkUserRegistration,
  getUser,
  setUserGroup,
};

const vk = new VK({ token: useRuntimeConfig().vkToken });

const prisma = usePrisma();
const fakeApi = useFakeAPI();

type SaveUserStateParams = {
  peerId: number;
  state?: string | null;
  city?: string | null;
  program?: string;
  organization?: string;
  key?: string;
  role?: string;
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
    program,
    organization,
    key,
    role,
  } = params;

  const updateData: any = {};

  if (state !== undefined) {
    updateData.state = state;
  }
  if (city !== undefined) {
    updateData.city = city;
  }
  if (program !== undefined) {
    updateData.program = program;
  }
  if (organization !== undefined) {
    updateData.organization = organization;
  }
  if (key !== undefined) {
    updateData.key = key;
  }
  if (role !== undefined) {
    updateData.role = role;
  }

  return prisma.users.upsert({
    where: { peerId },
    update: updateData,
    create: {
      peerId,
      state: state ?? null,
      city: city ?? null,
      program: program ?? null,
      organization: organization ?? null,
      key: key ?? null,
      role: role ?? null,
    }
  });
}


async function getUserState(peerId: number) {
  const user = await prisma.users.findUnique({
    where: { peerId },
    select: { state: true },
  });

  return user?.state || "";
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
  return data?.key || "";
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
  const permission = await $fetch("/api/miniapp/getOrgPermitions", {
    method: "GET",
    query: {
      userId: peerId,
    },
    keepalive: true,
  });

  return permission;
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


async function createNewUser(isChild: boolean, gender: string, name: string, surname: string, birthdate: string, phone: string, email: string, key: string, parentName?: string, parentSurname?: string) {
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
        accessCode: key,
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
        accessCode: key,
      }
    });
  }
  return true;
}


async function checkUserRegistration(peerId: number) {
  const userData = await prisma.users.findFirst({
    where: { peerId: peerId },
    select: { key: true },
  });

  if (userData?.key !== null) {
    const client = await fakeApi.client.findFirst({
      where: { accessCode: userData?.key! },
      select: { id: true },
    });
    return !!client;
  }
  else {
    return false;
  }
}

type UserParam = {
  peerId?: number,
  key?: string
}


async function getUser(userParam: UserParam) {
  return await prisma.users.findFirst({
    where: { peerId: userParam.peerId, key: userParam.key },
  });
}

async function setUserGroup(peerId: number, groupId: number) {
  const userKey = await getUserAccessCode(peerId);

  return await fakeApi.client.update({
    where: { accessCode: userKey },
    data: {
      groupId: groupId,
    },
  });
}