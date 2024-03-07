import {
  RequestResponseSchema,
  RequestSuccessSchema,
} from "@/middlewares/type";
import { createEndPoint, createRoute } from "safe-fetchttp";
import * as z from "zod";

export const signWithWebAuth = createEndPoint({
  HttpMethod: "POST",
  path: createRoute({
    fn: () => "/api/webauth/sign",
    paramsSchema: z.object({}),
    name: "signWithWebAuth",
    options: {
      internal: true,
    },
  }),
  body: z.object({
    userId: z.string().min(1),
  }),
  response: RequestResponseSchema(
    z.object({
      token: z.string().min(1),
    })
  ),
});
