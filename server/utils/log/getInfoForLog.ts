import { ChangeType, Prisma } from "~~/prisma/generated/prisma/db1/client";

export {
  getLessonFields,
  getClientFields,
  getEmployeeFields,
  getGroupFields,
  getVenueFields,
};

const fakeAPI = useFakeAPI();

async function getLessonFields(id: number) {
  const lesson = await fakeAPI.lesson.findUnique({
    where: { id: id },
    include: { program: true, group: true },
  });

  return {
    lessonId: id,
    lessonName: lesson?.program.name,
    lessonDate: lesson?.date,
    lessonStartTime: lesson?.startTime,
    groupId: lesson?.group.id,
    groupName: lesson?.group.name,
  };
}

async function getClientFields(id: number) {
  const client = await fakeAPI.client.findUnique({
    where: { id: id },
  });

  return {
    clientId: id,
    clientFirstName: client?.firstName,
    clientLastName: client?.lastName,
  };
}

async function getEmployeeFields(id: number) {
  const employee = await fakeAPI.employee.findUnique({ where: { id } });

  return {
    employeeId: id,
    employeeFirstName: employee!.firstName,
    empolyeeLastName: employee!.lastName,
  };
}

async function getGroupFields(id: number | null) {
  if (!id) {
    return {
      groupId: null,
      groupName: "Не распределен",
    };
  }
  const group = await fakeAPI.group.findUnique({ where: { id } });

  return { groupId: group?.id, groupName: group?.name };
}

async function getVenueFields(id: number) {
  const venue = await fakeAPI.venue.findUnique({ where: { id } });

  return { venueId: venue?.id, venueName: venue?.name };
}
