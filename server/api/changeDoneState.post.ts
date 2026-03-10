export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { id, done } = body;

    if (!id) {
        throw createError({
            statusCode: 400,
            statusMessage: 'ID is required'
        })
    }

    try {
        await prisma.recommendation.update({ where: { id: id }, data: { done: done } });
        return {status: 200};
    }
    catch (error) {
        console.error(error);
        throw createError({ statusCode: 500, statusMessage: 'Server error' });
    }

})