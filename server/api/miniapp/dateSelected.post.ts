import { defineEventHandler, readBody } from 'h3';
import { VK } from 'vk-io';

const vk = new VK({ token: useRuntimeConfig().vkToken });

interface Body {
  date: string;
  userId: number;
}

export default defineEventHandler(async (event) => {
  const body = await readBody<Body | undefined>(event);

  if (!body) {
    event.node.res.statusCode = 400;
    return { ok: false, error: 'Empty body' };
  }

  const { date, userId } = body;

  if (!date || !userId) {
    event.node.res.statusCode = 400;
    return { ok: false, error: 'date or userId missing' };
  }

  await vk.api.messages.send({
    peer_id: userId,
    random_id: Date.now(),
    message: `Вы выбрали дату: ${date}`,
  });

  return { ok: true };
});