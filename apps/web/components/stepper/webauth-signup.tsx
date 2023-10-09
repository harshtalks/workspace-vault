"use client";
import { CheckIcon, ReloadIcon } from "@radix-ui/react-icons";
import * as React from "react";

import { cn } from "@ui/lib/utils";
import { Button } from "@ui/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@ui/components/ui/card";
import { Separator } from "@ui/components/ui/separator";
import { Checkbox } from "@ui/components/ui/checkbox";

import Link from "next/link";
import FormAction from "./form-action";
import { webAuthnHandler } from "@/async/web-auth";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";
import { SignJWT } from "jose";

type CardProps = React.ComponentProps<typeof Card>;

export type WebAuthSignedStates = "error" | "success" | "isPending" | "idle";

export function WebAuthSignup({ className, ...props }: CardProps) {
  const [isChecked, setIsChecked] = React.useState(false);
  const [isSigned, setIsSigned] = React.useState<WebAuthSignedStates>("idle");
  const router = useRouter();

  const { userId } = useAuth();

  const handler = async () => {
    try {
      const result = await webAuthnHandler(setIsSigned);

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

        toast.success(
          "your key is generated for this device and specified method: "
        );

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
    <Card className={cn("max-w-[550px]", className)} {...props}>
      <CardHeader>
        <CardTitle>
          <span className="text-4xl font-bold block mb-1">1.</span>
          Multi Factor Authorization
        </CardTitle>
        <CardDescription>
          <p className="mt-2">
            We utilize WebAuthn to create a set of cryptographic keys: a private
            key (passkey) that remains securely stored on your device and a
            corresponding public key that is retained on our server. This public
            key is employed to encrypt your files, ensuring their security
            during transmission and storage. To decrypt these files on your end,
            your private passkey is used, guaranteeing that your data remains
            confidential and inaccessible to unauthorized parties. This approach
            is designed to maintain the utmost privacy and safeguard your data
            from any potential breaches. If you'd like to delve deeper into the
            mechanics of this process, you can find additional information{" "}
            <Link
              className="underline hover:text-zinc-900 hover:dark:text-white"
              href="https://webauthn.guide/"
              target="_blank"
            >
              here
            </Link>
          </p>
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
        <Separator />
        <div>
          <div className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
            <Checkbox
              checked={isChecked}
              onCheckedChange={() => setIsChecked((ch) => !ch)}
            />
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">
                I understand, passkey is the only way to verify myself
              </p>
              <p className="text-sm text-muted-foreground">
                Once lost, you will not be able to restore any of your envs
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <FormAction
          isDisabled={!(isChecked && isSigned === "success")}
          link="/get-started/generate-secret"
        />
      </CardFooter>
    </Card>
  );
}
