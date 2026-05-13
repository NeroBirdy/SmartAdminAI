import { ChangeType, Prisma } from "~~/prisma/generated/prisma/db1/client";

export {
  getLessonFields,
  getClientFields,
  getEmployeeFields,
  getGroupFields,
  getVenueFields,
  getFieldsForLog,
};

const fakeAPI = useFakeAPI();
const prisma = usePrisma();

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
    lessonStatus: lesson?.status,
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

async function getFieldsForLog(id: number) {
  const log = await prisma.log.findUnique({ where: { id } });
  if (!log) return {};

  const entityId = log.entityId;

  const type =
    log.changeType !== "LOG_ROLLBACK" ? log.changeType : log.originalChangeType;

  switch (type) {
    case "DATE_CHANGE":
    case "LESSON_CANCELLATION":
    case "LESSON_CREATE": {
      return await getLessonFields(entityId);
    }

    case "VENUE_CHANGE": {
      const lessonFields = await getLessonFields(entityId);
      const lesson = await fakeAPI.lesson.findUnique({
        where: { id: entityId },
      });
      const venueFields = await getVenueFields(lesson!.venueId);
      return { ...lessonFields, ...venueFields };
    }

    case "INSTRUCTOR_CHANGE": {
      const lessonFields = await getLessonFields(entityId);
      const lesson = await fakeAPI.lesson.findUnique({
        where: { id: entityId },
      });
      const employeeFields = await getEmployeeFields(lesson!.instructorId);
      return { ...lessonFields, ...employeeFields };
    }

    case "ASSIGNED_TO_GROUP": {
      const clientFields = await getClientFields(entityId);
      const client = await fakeAPI.client.findUnique({
        where: { id: entityId },
      });
      const groupFields = await getGroupFields(client!.groupId);
      return { ...clientFields, ...groupFields };
    }

    default:
      return {};
  }
}
