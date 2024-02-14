import { Redis } from "@upstash/redis";

export const redisClient = new Redis({
  url: "https://apn1-heroic-fawn-33969.upstash.io",
  token:
    "AYSxASQgYzc0OTM3NTMtZTc0MC00MDFmLTllMDctOTc3YTcyNjZiM2JkNjZmZjJhZDUxZjkzNGE5YTgyYjEzZmFhNWYyNzUxZmM=",
});
