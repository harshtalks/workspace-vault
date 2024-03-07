import { RequestResponseSchema } from "@/middlewares/type";
import { createEndPoint, createRoute } from "safe-fetchttp";
import { object, string } from "zod";

export const authenticateWithWebAuthn = createEndPoint({
  HttpMethod: "POST",
  body: object({
    userId: string(),
  }),
  path: createRoute({
    fn: () => "/api/webauth/verify",
    name: "verifyWebAuth",
    options: {
      internal: true,
    },
    paramsSchema: object({}),
  }),
  response: RequestResponseSchema(object({})),
});
