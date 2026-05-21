export default defineEventHandler(async (event) => {
  const query = await getQuery(event);
  const userId = Number(query.userId);

  const userSession = await getUserSession(userId);

  const state = userSession.state;

  return { state };
});
