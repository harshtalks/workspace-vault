"use client";
import { CheckIcon, ReloadIcon } from "@radix-ui/react-icons";
import * as React from "react";

import { cn } from "@ui/lib/utils";
import { Button } from "@ui/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ui/components/ui/card";

import Link from "next/link";
import { webAuthnHandler } from "@/async/web-auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { SignJWT } from "jose";
import { RequestResponse } from "@/middlewares/type";
import { useAuth } from "@/app/session-provider";
import { signWithWebAuth } from "@/app/api/webauth/sign/sign.fetcher";

type CardProps = React.ComponentProps<typeof Card>;

export type WebAuthSignedStates = "error" | "success" | "isPending" | "idle";

export function WebAuthSignup({ className, ...props }: CardProps) {
  const [isSigned, setIsSigned] = React.useState<WebAuthSignedStates>("idle");
  const router = useRouter();

  const { user } = useAuth();

  const userId = user?.id;

  const handler = async () => {
    try {
      const result = await webAuthnHandler(setIsSigned);

      if (result && userId) {
        setIsSigned("isPending");

        const result = await signWithWebAuth({
          params: {},
          body: {
            userId: userId,
          },
        });

        if (result.status !== "success") {
          throw new Error(result.error);
        }

        toast.success("You are logged in successfully.");

        router.push("/get-started/workspaces");
        setIsSigned("success");
      }
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
    <Card className={cn("max-w-[450px] my-8", className)} {...props}>
      <CardHeader>
        <CardTitle>Multi Factor Authorization</CardTitle>
        <CardDescription className="mt-2">
          We utilize WebAuthn to add an extra layer of protection to your
          account. This technology creates a set of cryptographic keys: a
          private key that remains securely stored on your device, and a
          corresponding public key that we retain on our server. This public key
          is used to register your device, providing an additional level of
          security when accessing env files in your account. This ensures the
          secure transmission and storage of your data. To decrypt these files
          on your end, your secret key (next step) is used, ensuring that your
          data remains confidential and inaccessible to unauthorized parties.
          This approach is designed to maintain the utmost privacy and safeguard
          your data from any potential breaches. If you&apos;d like to delve
          deeper into the mechanics of this process, you can find additional
          information
          <Link
            className="underline hover:text-zinc-900 hover:dark:text-white"
            href="https://webauthn.guide/"
            target="_blank"
          >
            here
          </Link>
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Button
          onClick={async () => {
            handler();
          }}
          size="sm"
          disabled={isSigned === "isPending"}
        >
          <>
            {isSigned === "isPending" && (
              <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
            )}
            {isSigned === "success" ? "Key Generated" : "Generate Key"}
          </>
        </Button>
        <Button
          variant="link"
          onClick={() => router.push("/get-started/authenticate")}
        >
          Already Authenticated before?
        </Button>
      </CardContent>
    </Card>
  );
}
