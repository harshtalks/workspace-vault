import { Button } from "@ui/components/ui/button";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import ROUTES from "@/lib/routes";

const Deauthenticate = () => {
  return cookies().has("webAuthn") ? (
    <div>
      <p className="text-xs text-zinc-600">
        You are currently authenticated with webauthn
      </p>
      <Link href={ROUTES.webAuthDeAuth({})}>
        <Button variant="outline" className="mt-3">
          De authenticate
        </Button>
      </Link>
    </div>
  ) : (
    <></>
  );
};

export default Deauthenticate;
