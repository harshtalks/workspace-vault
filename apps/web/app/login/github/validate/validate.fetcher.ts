import { validateRequest } from "@/lib/auth/auth";
import { RequestSuccessSchema } from "@/middlewares/type";
import { Session, User } from "lucia";
import { createEndPoint, createRoute } from "safe-fetchttp";
import * as z from "zod";

const UserSchema: z.ZodType<User> = z.lazy(() =>
  z.object({
    githubId: z.string().nullable(),
    id: z.string(),
    username: z.string(),
    avatar: z.string().url().nullable(),
    email: z.string().email(),
  })
);

const SessionSchema: z.ZodType<Session> = z.lazy(() =>
  z.object({
    expiresAt: z.coerce.date(),
    fresh: z.boolean(),
    userId: z.string(),
    id: z.string(),
  })
);

const ResponseSchema: z.ZodType<Awaited<ReturnType<typeof validateRequest>>> =
  z.lazy(
    () => z.object({ user: UserSchema, session: SessionSchema }),
    z.object({ user: z.null(), session: z.null() })
  );

export const getAuth = createEndPoint({
  HttpMethod: "GET",
  path: createRoute({
    fn: () => "/login/github/validate",
    options: {
      internal: true,
    },
    paramsSchema: z.object({}),
    name: "getAuth",
  }),
  response: RequestSuccessSchema(ResponseSchema),
});
