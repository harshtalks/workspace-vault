"use client";
import { useAuth } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import GenerateKey from "./generate-key";
import { secretDB } from "@/utils/local-store";
import { Skeleton } from "@ui/components/ui/skeleton";
import { Separator } from "@ui/components/ui/separator";
import { Button } from "@ui/components/ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Secret } from "database";
import useSecret from "@/hooks/use-secret";
import { RequestResponse, RequestSuccess } from "@/middlewares/type";
import Link from "next/link";
import { toast } from "sonner";

export type WrapperForGeneratingKeyProps = React.ComponentProps<
  typeof WrapperForGeneratingKey
>;

const WrapperForGeneratingKey = ({ workspace }: { workspace: string }) => {
  const { userId } = useAuth();
  const [hasKeyFoundAlready, setHasKeyFoundAlready] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const { isLoading, error, data } = useSecret(
    workspace,
    setHasKeyFoundAlready
  );

  const buttonHandler = async () => {
    setIsPending(true);
    try {
      const response = await fetch("/api/secret/delete", {
        method: "POST",
        body: JSON.stringify({
          workspace,
        }),
      });

      const responseJson = (await response.json()) as RequestResponse<Secret>;

      if (responseJson.status === "error") {
        throw new Error(responseJson.error);
      }

      await secretDB.open();

      await secretDB.secrets.delete(workspace);

      if (responseJson) {
        toast.success(
          "we have removed your envs from the server. you can store again with new secret."
        );
      }

      setHasKeyFoundAlready(false);
      setIsPending(false);
    } catch (error) {
      error instanceof Error
        ? toast.error(`${error.name}: ${error.message}`)
        : toast.error(`An error occured! Please try again.`);
    } finally {
      setIsPending(false);
    }
  };

  return isLoading ? (
    <div className="flex items-center justify-center flex-col">
      <div className="space-y-2">
        <Skeleton className="h-8 w-[250px]" />
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[250px]" />
        <div className="flex items-center space-x-2">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    </div>
  ) : data && data.status === "success" && data.result && hasKeyFoundAlready ? (
    <div className="flex flex-col space-y-2 text-center">
      <Separator />
      <h1 className="text-2xl font-semibold tracking-tight">
        Existing key found.
      </h1>
      <p className="text-sm text-muted-foreground">
        you can generate a new one (you will loose all your envs) or use the
        existing one.
      </p>
      <div className="flex space-x-4 pt-4">
        <Link
          className="w-full"
          href={"/workspaces/" + workspace + "/enter-secret"}
        >
          <Button disabled={isPending} className="w-full">
            Use Existing
          </Button>
        </Link>
        <Button
          onClick={async () => await buttonHandler()}
          className="w-full"
          variant="outline"
          disabled={isPending}
        >
          <>
            {isPending && <ReloadIcon className="h-4 w-4 mr-2 animate-spin" />}
            Generate New
          </>
        </Button>
      </div>
    </div>
  ) : (
    <GenerateKey workspace={workspace} />
  );
};

export default WrapperForGeneratingKey;
