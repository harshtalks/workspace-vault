"use client";
import { useIphonePassword } from "@/hooks/use-iphone-password";
import useSecret from "@/hooks/use-secret";
import { WorkspaceResponse } from "@/middlewares/type";
import { secretDB } from "@/utils/local-store";
import {
  EyeClosedIcon,
  EyeNoneIcon,
  EyeOpenIcon,
  ReloadIcon,
} from "@radix-ui/react-icons";
import { Button } from "@ui/components/ui/button";
import { Input } from "@ui/components/ui/input";
import { Skeleton } from "@ui/components/ui/skeleton";
import { generateMasterKey, getSalt } from "cryptography";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

const Form = ({ workspace }: { workspace: string }) => {
  const { data, isLoading, error } = useSecret(workspace);
  const [hidden, setHidden] = useState(true);
  const [value, presentation, onChange, futurePresentation] = useIphonePassword(
    {
      mask: "•",
      delay: 150,
      mode: "delayed",
    }
  );

  const [isFetchig, setIsFetching] = useState(false);

  const { push } = useRouter();

  const handler = async () => {
    setIsFetching(true);

    try {
      // verifying the hash

      const response = await fetch("/api/secret/verify-secret", {
        method: "POST",
        body: JSON.stringify({
          workspace: workspace,
          secretValue: value,
        }),
      });

      const responseJson: WorkspaceResponse<boolean> = await response.json();

      if (responseJson.status === "error") {
        throw new Error(responseJson.error);
      }

      // generate master key
      const saltValue = getSalt();

      // master key
      const masterKey = await generateMasterKey(value, saltValue);

      await secretDB.open();

      await secretDB.secrets.delete(workspace);

      await secretDB.secrets.add(
        {
          workspace: workspace,
          key: masterKey,
        },
        workspace
      );

      const _ = await secretDB.secrets.get(workspace);

      toast.success(
        "you have configured your secret. you will lose all your data in case forgotten."
      );

      push("workspaces/" + workspace + "/overview");
    } catch (error) {
      error instanceof Error
        ? toast.error(`${error.name}: ${error.message}`)
        : toast.error(
            `An error occured! Please try
              again.`
          );
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <div className="w-full">
      {isLoading ? (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Skeleton className="w-full h-10" />
            <Skeleton className="w-20 h-10" />
          </div>
          <Skeleton className="w-full h-10" />
        </div>
      ) : data.status === "error" ? (
        <div>
          <h2>
            We could not find any secret associated with the given workspace id.
          </h2>
        </div>
      ) : (
        <div className="flex flex-col space-y-2">
          <div className="flex items-center gap-2">
            <Input
              value={hidden ? presentation : value}
              onChange={onChange}
              placeholder="secret key here..."
            />
            <Button
              onClick={() => {
                setHidden((cur) => !cur);
              }}
              className="w-fit"
              variant="outline"
            >
              {hidden ? (
                <>
                  <EyeOpenIcon className="h-4 w-4" />
                </>
              ) : (
                <>
                  <EyeNoneIcon className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>

          <Button disabled={isFetchig} onClick={handler}>
            <>
              {isFetchig && (
                <ReloadIcon className="mr-2 w-4 h-4 animate-spin" />
              )}
              Proceed
            </>
          </Button>
        </div>
      )}
    </div>
  );
};

export default Form;
