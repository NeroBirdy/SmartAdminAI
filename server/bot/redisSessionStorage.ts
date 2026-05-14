import { createClient, RedisClientType } from 'redis';

export function createRedisSessionStorage(prefix = 'vk-session:') {
  const client: RedisClientType = createClient({
    url: process.env.REDIS_URL || 'redis://127.0.0.1:6379',
  });

  client.on('error', (err) => {
    console.error('Redis client error', err);
  });

  client.connect().catch(console.error);

  const storage = {
    async get(key: string): Promise<object | undefined> {
      const raw = await client.get(prefix + key);
      if (!raw) return {};
      try {
        return JSON.parse(raw);
      } catch {
        return {};
      }
    },

    async set(key: string, value: object): Promise<boolean> {
      const data = JSON.stringify(value);
      await client.set(prefix + key, data);
      return true;
    },

    async delete(key: string): Promise<boolean> {
      await client.del(prefix + key);
      return true;
    },

    async touch(_key: string): Promise<boolean> {
      return true;
    },
  };

  return storage;
}