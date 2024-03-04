import { lucia, validateRequest } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { Button } from "@ui/components/ui/button";
import { getAuth } from "@/app/login/github/validate/validate.fetcher";

export const SignOut = async () => {
  const logout = async () => {
    "use server";

    const { session } = await validateRequest();
    if (!session) {
      return {
        error: "Unauthorized",
      };
    }

    await lucia.invalidateSession(session.id);

    const sessionCookie = lucia.createBlankSessionCookie();
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );
    return redirect("/");
  };

  const { session } = await validateRequest();

  return session ? (
    <form action={logout}>
      <Button variant="secondary" type="submit">
        Sign Out
      </Button>
    </form>
  ) : null;
};
