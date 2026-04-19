import { Venue } from "~~/prisma/generated/prisma/db2/client";

const fakeAPI = useFakeAPI();
const prisma = usePrisma();

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const orgId = Number(query.orgId);

  const venues = await fakeAPI.venue.findMany({
    where: { organizationId: orgId },
  });

  return await Promise.all(
    venues.map(async (venue: Venue) => {
      const scheduleExists = await prisma.workSchedule.findFirst({
        where: { venueId: venue.id, isWorkingDay: true },
      });

      return {
        id: venue.id,
        name: venue.name,
        scheduleExist: !!scheduleExists,
      };
    }),
  );
});
