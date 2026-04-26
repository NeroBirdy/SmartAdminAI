const prisma = usePrisma();
const fakeAPI = useFakeAPI();

export default defineEventHandler(async (event) => {
  const query = await getQuery(event);
  const orgId = Number(query.orgId);

  const instructors = await fakeAPI.employee.findMany({
    where: { role: "INSTRUCTOR" },
    select: {
      accessCode: true,
      firstName: true,
      lastName: true,
    },
  });

  const codes = instructors.map((inst) => inst.accessCode);

  const loginnedInstrucotrs = await prisma.users.findMany({
    where: { key: { in: codes } },
  });

  const result = instructors.map((inst) => ({
    loginned: loginnedInstrucotrs.some((u) => u.key === inst.accessCode),
    firstName: inst.firstName,
    lastName: inst.lastName,
  }));

  const allLoginned = result.every((inst) => inst.loginned);

  return { allLoginned, list: result };
});
