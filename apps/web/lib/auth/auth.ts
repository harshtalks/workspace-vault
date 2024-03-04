import { Lucia, TimeSpan } from "lucia";
import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import db, { sessions, users } from "database";
import { cookies } from "next/headers";
import { cache } from "react";
import type { Session, User } from "lucia";
import { GitHub } from "arctic";

const adapter = new DrizzlePostgreSQLAdapter(db, sessions, users);

// IMPORTANT!
declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: Omit<typeof users.$inferSelect, "id">;
  }
}

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    // this sets cookies with super long expiration
    // since Next.js doesn't allow Lucia to extend cookie expiration when rendering pages
    expires: false,
    attributes: {
      // set to `true` when using HTTPS
      secure: process.env.NODE_ENV === "production",
    },
  },
  getUserAttributes: (attributes) => ({
    githubId: attributes.githubId,
    username: attributes.username,
    avatar: attributes.avatar,
    email: attributes.email,
  }),
  sessionExpiresIn: new TimeSpan(7, "d"),
});

export const validateRequestWithoutCache = async (): Promise<
  { user: User; session: Session } | { user: null; session: null }
> => {
  const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;

  if (!sessionId) {
    return {
      user: null,
      session: null,
    };
  }

  const result = await lucia.validateSession(sessionId);

  // next.js throws when you attempt to set cookie when rendering page
  try {
    if (result.session && result.session.fresh) {
      const sessionCookie = lucia.createSessionCookie(result.session.id);
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );
    }

    if (!result.session) {
      const sessionCookie = lucia.createBlankSessionCookie();
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );
    }
  } catch {}
  return result;
};

export const validateRequest = cache(validateRequestWithoutCache);

const clientId = process.env.GITHUB_CLIENT_ID;
const clientSecret = process.env.GITHUB_CLIENT_SECRET;

if (!clientId || !clientSecret) {
  throw new Error("GitHub client ID and client secret are not set");
}

export const github = new GitHub(clientId, clientSecret);
