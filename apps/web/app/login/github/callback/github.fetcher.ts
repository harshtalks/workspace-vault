import { createEndPoint, createRoute } from "safe-fetchttp";
import * as z from "zod";

export const getGithubUserEmails = createEndPoint({
  HttpMethod: "GET",
  path: createRoute({
    fn: () => "/user/emails",
    options: {
      internal: false,
      baseUrl: "https://api.github.com",
    },
    paramsSchema: z.object({}),
    name: "getGithubUserEmails",
  }),
  response: z.array(
    z.object({
      email: z.string().email(),
      primary: z.boolean(),
      verified: z.boolean(),
      visibility: z.string().nullable(),
    })
  ),
});

export const getGithubUser = createEndPoint({
  HttpMethod: "GET",
  path: createRoute({
    fn: () => "/user",
    options: {
      internal: false,
      baseUrl: "https://api.github.com",
    },
    paramsSchema: z.object({}),
    name: "getGithubUser",
  }),
  response: z.object({
    login: z.string().min(1),
    avatar_url: z.string().url(),
    name: z.string(),
  }),
});
