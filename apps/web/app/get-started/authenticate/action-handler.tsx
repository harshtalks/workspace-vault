"use client";
import { authenticateWithWebAuthn } from "@/app/api/webauth/verify/jwt.fetcher";
import { useAuth } from "@/app/session-provider";
import { handleWebAuthenticate } from "@/async/web-auth";
import { WebAuthSignedStates } from "@/components/stepper/webauth-signup";
import ROUTES from "@/lib/routes";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Button } from "@ui/components/ui/button";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

const ActionHandler = () => {
  const [isSigned, setIsSigned] = React.useState<WebAuthSignedStates>("idle");
  const { user } = useAuth();
  const userId = user?.id;
  const router = useRouter();
  const { callbackMFA } = ROUTES.webAuthRedirect.useSearchParams();

  const handler = async () => {
    try {
      const result = await handleWebAuthenticate(setIsSigned);

      if (result && userId) {
        setIsSigned("isPending");

        const result = await authenticateWithWebAuthn({
          body: {
            userId: userId,
          },
          params: {},
        });

        if (result.status === "error") {
          throw new Error(result.error);
        }

        toast.message("Lesgoo", {
          description: "You are logged in successfully",
        });
      }

      router.push(callbackMFA ? callbackMFA : "/get-started/workspaces");
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
      {isSigned === "isPending" && (
        <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
      )}
      Authenticate
    </Button>
  );
};

export default ActionHandler;
