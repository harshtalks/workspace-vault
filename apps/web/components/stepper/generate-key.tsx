"use client";
import { Button } from "@ui/components/ui/button";
import { Input } from "@ui/components/ui/input";
import { cn } from "@ui/lib/utils";
import {
  CopyIcon,
  CheckIcon,
  EyeOpenIcon,
  EyeNoneIcon,
  ReloadIcon,
} from "@radix-ui/react-icons";
import { generateMasterKey, generatePassword, getSalt } from "cryptography";

import * as React from "react";
import copy from "copy-to-clipboard";
import { secretDB } from "@/utils/local-store";
import { useAuth } from "@clerk/nextjs";
import { WorkspaceResponse } from "@/middlewares/type";
import { Secret } from "database";
import { useRouter } from "next/navigation";
import { useIphonePassword } from "@/hooks/use-iphone-password";
import { toast } from "sonner";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

function GenerateKey({
  className,
  workspace,
  ...props
}: UserAuthFormProps & { workspace: string }) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isCopied, setIsCopied] = React.useState(false);
  const [showSecret, setShowSecret] = React.useState(false);

  const [secret, presentation, onChange, generatingValue] = useIphonePassword({
    delay: 150,
  });

  const router = useRouter();

  React.useEffect(() => {
    isCopied && setIsCopied((copied) => !copied);
  }, [secret]);

  const handler = async () => {
    if (!secret) {
      toast.error("Please Enter the secret before proceeding or generate one.");
      return;
    }

    try {
      setIsLoading(true);
      // generate master key
      const saltValue = getSalt();

      // master key
      const masterKey = await generateMasterKey(secret, saltValue);

      // saving in the prisma store
      const savedHashResponse = await fetch("/api/secret/store", {
        method: "POST",
        body: JSON.stringify({
          secret,
          workspace,
        }),
      });

      const savedHashResponseJson =
        (await savedHashResponse.json()) as WorkspaceResponse<Secret>;

      if (savedHashResponseJson.status === "error") {
        throw new Error(savedHashResponseJson.error);
      }

      await secretDB.open();

      await secretDB.secrets.clear();

      const key = await secretDB.secrets.add(
        {
          workspace: workspace,
          key: masterKey,
        },
        workspace
      );

      console.log(key);

      const _ = await secretDB.secrets.get(workspace);

      toast.success(
        "you have configured your secret. you will lose all your data in case forgotten."
      );
      router.push("workspaces/" + workspace + "/overview");
    } catch (error) {
      error instanceof Error
        ? toast.error(`${error.name}: ${error.message}`)
        : toast.error(`An error occured! Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <div className="grid gap-2">
        <div className="flex items-center gap-1">
          <p className="text-lg font-bold">JWX</p>
          <p> - </p>
          <Input
            placeholder="Enter key here..."
            type="text"
            autoCapitalize="none"
            autoComplete="password"
            disabled={isLoading}
            value={showSecret ? secret : presentation}
            onChange={onChange}
          />
        </div>
        <Button onClick={handler} type="submit" disabled={isLoading}>
          <>
            {isLoading && <ReloadIcon className="mr-2 animate-spin" />} Continue
          </>
        </Button>
        <div className="flex gap-2">
          <Button
            disabled={!secret}
            onClick={() => {
              copy(secret);
              toast.success(
                "Secret Copied to the clipboard. Please store it somewhere safe."
              );
              !isCopied && setIsCopied(true);
            }}
            variant="outline"
          >
            {isCopied ? (
              <>
                <CheckIcon className="mr-1" /> Copied
              </>
            ) : (
              <>
                <CopyIcon className="mr-1" /> Copy
              </>
            )}
          </Button>
          <Button
            onClick={() => setShowSecret((show) => !show)}
            variant="outline"
          >
            {showSecret ? (
              <>
                <EyeNoneIcon className="mr-2" /> Hide Secret
              </>
            ) : (
              <>
                <EyeOpenIcon className="mr-2" /> Show Secret
              </>
            )}
          </Button>
        </div>
      </div>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or</span>
        </div>
      </div>
      <Button
        onClick={() => {
          toast.success(
            "make sure you copy it and write it down somewhere safe."
          );
        }}
        variant="outline"
        type="button"
        disabled={isLoading}
      >
        Generate one for me
      </Button>
    </div>
  );
}

export default GenerateKey;
