import { Redis } from "@upstash/redis";

export const redisClient = new Redis({
  url: "https://apn1-relative-elk-34945.upstash.io",
  token:
    "AYiBASQgMDg5MTJhNTItY2Q4OS00MmI3LTgwZmMtMjNlZjdkMTlmNzA3MTYwZjE3NDQxZTIxNDkzMmEzNmFmZjdhYjFlMTRjNmM=",
});
