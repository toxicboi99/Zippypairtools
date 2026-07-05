type RedisLike = {
  get: (key: string) => Promise<string | null>;
  set: (key: string, value: string) => Promise<void>;
  del: (key: string) => Promise<void>;
};

let redis: RedisLike | null = null;
const memoryRedis = new Map<string, string>();

export function getRedis(): RedisLike {
  if (!redis) {
    redis = {
      async get(key) {
        return memoryRedis.get(key) ?? null;
      },
      async set(key, value) {
        memoryRedis.set(key, value);
      },
      async del(key) {
        memoryRedis.delete(key);
      },
    };
  }

  return redis;
}
