export default defineEventHandler(async (event) => {
  const query = await getQuery(event);
  const userId = Number(query.userId);

  const state = await getUserState(userId);

  return { state };
});