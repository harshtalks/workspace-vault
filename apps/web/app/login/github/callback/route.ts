import { cookies } from "next/headers";
import { OAuth2RequestError } from "arctic";
import { generateId } from "lucia";
import db, { eq, users } from "database";
import { github, lucia } from "@/lib/auth/auth";
import { nanoid } from "nanoid";
import { getGithubUser, getGithubUserEmails } from "./github.fetcher";

export const GET = async (req: Request): Promise<Response> => {
  const url = new URL(req.url);

  const code = url.searchParams.get("code");

  const state = url.searchParams.get("state");

  const storedState = cookies().get("github_oauth_state")?.value ?? null;

  if (!code || !state || !storedState || state !== storedState) {
    return new Response(null, {
      status: 307,
      statusText: "Bad Request",
    });
  }

  try {
    const token = await github.validateAuthorizationCode(code);
    const githubUserResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
      },
    });

    const githubUser = await getGithubUser({
      params: {},
      init: {
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
        },
      },
      body: {},
    });

    const githubUserEmails = await getGithubUserEmails({
      init: {
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
        },
      },
      params: {},
      body: {},
    });

    const seeIfUserExists = await db.query.users.findFirst({
      where: eq(users.githubId, githubUser.login),
    });

    if (seeIfUserExists) {
      const session = await lucia.createSession(seeIfUserExists.id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);

      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );

      return new Response(null, {
        status: 302,
        headers: {
          Location: "/",
        },
      });
    }

    const user = await db
      .insert(users)
      .values({
        id: nanoid(),
        username: githubUser.login,
        githubId: githubUser.login,
        email: githubUserEmails[0].email,
        avatar: githubUser.avatar_url,
        ...(githubUser.name &&
          githubUser.name.split("").length > 1 && {
            firstName: githubUser.name.split(" ")[0],
            lastName: githubUser.name.split(" ")[1],
          }),
      })
      .returning();

    const session = await lucia.createSession(user[0].id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    return new Response(null, {
      status: 302,
      headers: {
        Location: "/",
      },
    });
  } catch (e) {
    console.log(e);
    if (
      e instanceof OAuth2RequestError &&
      e.message === "bad_verification_code"
    ) {
      // invalid code
      return new Response(null, {
        status: 400,
        statusText: e.message,
      });
    }

    return new Response(null, {
      status: 500,
      statusText: e instanceof Error ? e.message : "Internal Server Error",
    });
  }
};
