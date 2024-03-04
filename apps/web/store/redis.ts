import { Redis } from "@upstash/redis";

const redisURL = process.env.REDIS_URL;
const redisToken = process.env.REDIS_TOKEN;

if (!redisURL || !redisToken) {
  throw new Error("REDIS_URL or REDIS_TOKEN is not set");
}

export const redisClient = new Redis({
  url: redisURL,
  token: redisToken,
});
