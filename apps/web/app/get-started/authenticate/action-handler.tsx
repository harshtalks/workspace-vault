"use client";
import { handleWebAuthenticate } from "@/async/web-auth";
import { WebAuthSignedStates } from "@/components/stepper/webauth-signup";
import { useAuth } from "@clerk/nextjs";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Button } from "@ui/components/ui/button";
import { SignJWT } from "jose";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { toast } from "sonner";

const ActionHandler = () => {
  const [isSigned, setIsSigned] = React.useState<WebAuthSignedStates>("idle");
  const { userId } = useAuth();
  const router = useRouter();
  const callbackUrl = useSearchParams().get("callbackMFA");

  const handler = async () => {
    try {
      const result = await handleWebAuthenticate(setIsSigned);

      if (result) {
        setIsSigned("isPending");
        const alg = "HS256";

        const secret = new TextEncoder().encode(
          "cc7e0d44fd473002f1c42167459001140ec6389b7353f8088f4d9a95f2f596f2"
        );

        const jwt = await new SignJWT({ userId })
          .setProtectedHeader({ alg })
          .setExpirationTime("24h")
          .sign(secret);

        const response = await fetch("/api/internal/jwt", {
          method: "POST",
          body: JSON.stringify({
            jwt,
          }),
        });

        const _ = await response.json();

        toast.message("Congrats", {
          description: "your key is generated for this device.",
        });
      }

      router.push(callbackUrl ? callbackUrl : "/get-started/workspaces");
      router.refresh();
      setIsSigned("success");
    } catch (error) {
      setIsSigned("error");
      error instanceof Error
        ? toast.error(`${error.name}: ${error.message}`)
        : toast.error(`An error occured! Please try again.`);
    } finally {
      setIsSigned("idle");
    }
  };
  return (
    <Button disabled={isSigned === "isPending"} onClick={handler}>
      <>
        {isSigned === "isPending" && (
          <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
        )}
        Authenticate
      </>
    </Button>
  );
};

export default ActionHandler;
