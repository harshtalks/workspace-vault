import { Button } from "@ui/components/ui/button";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

const Deauthenticate = () => {
  const deleteCookie = async () => {
    "use server";
    cookies().delete("webAuthn");
    revalidatePath("/");
  };

  return cookies().has("webAuthn") ? (
    <form action={deleteCookie}>
      <p className="text-xs text-zinc-600">
        You are currently authenticated with webauthn
      </p>
      <Button variant="outline" className="mt-3">
        De authenticate
      </Button>
    </form>
  ) : (
    <></>
  );
};

export default Deauthenticate;
