import { Redis } from "@upstash/redis";

export const redisClient = new Redis({
  url: process.env.NEXT_PUBLIC_REDIS_URL,
  token: process.env.NEXT_PUBLIC_REDIS_SECRET,
});
