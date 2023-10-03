"use client";
import { EyeNoneIcon, EyeOpenIcon, ReloadIcon } from "@radix-ui/react-icons";
import { Button } from "@ui/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@ui/components/ui/card";
import { Textarea } from "@ui/components/ui/textarea";
import React, { useState } from "react";
import { WhatServerPromisedMeUponTheirSuccess } from "../page";
import { toast } from "sonner";
import { secretDB } from "@/utils/local-store";
import { decryptTextWithAESGCM } from "cryptography";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Details = ({
  results,
  workspace,
  env,
}: {
  results: WhatServerPromisedMeUponTheirSuccess;
  workspace: string;
  env: string;
}) => {
  // fake value
  const length = 15;

  const router = useRouter();

  const [canEdit, setEdit] = useState(false);
  const [isEncrypted, setIsEncrypted] = useState(false);
  const [variable, setVariable] = useState(results.result.variables);

  const decryptIt = async () => {
    try {
      await secretDB.open();

      const getMasterKey = await secretDB.secrets.get(workspace);

      if (!getMasterKey) {
        throw new Error("No key available to decrypt it.");
      }

      const key = getMasterKey.key;

      // encrypting..

      const decryptedText = await decryptTextWithAESGCM(variable, key);

      setIsEncrypted(true);
      setVariable(decryptedText);
      toast.success("Lesssgo, Decrypted envs...");
    } catch (error) {
      error instanceof Error && toast.error(error.message);
    }
  };

  return (
    <Card className="w-full my-4">
      <CardHeader>
        <CardTitle>
          <div className="flex flex-col space-y-2">
            <h2>{results.result.name}</h2>
            <p className="text-base text-zinc-500 font-normal">
              Added on{" "}
              {new Date(results.result.created_at).toLocaleDateString()}
            </p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid w-full items-center gap-4">
          <div className="flex flex-col space-y-1.5">
            {isEncrypted ? (
              <div className="flex py-2 space-x-2 border outline-2 focus-visible:ring-2 focus-visible:ring-ring rounded-md overflow-auto max-h-[400px]">
                <div className="pl-2 p-0 h-full text-zinc-600 border-zinc-700">
                  {Array.from({
                    length: variable.split("\n").length,
                  }).map((_, _index) => (
                    <React.Fragment key={_index}>
                      <p className="text-sm pr-2 border-r-2 font-mono">
                        {(_index + 1).toString().padStart(2, "0")}
                      </p>
                    </React.Fragment>
                  ))}
                </div>
                <Textarea
                  className="w-full font-mono h-full appearance-none resize-none m-0 text-sm focus-visible:ring-0 rounded-0 outline-0 p-0 ring-0 border-0"
                  rows={Math.max(9, variable.split("\n").length)}
                  placeholder="Enter Input as ENV_KEY=ENV_VALUE"
                  disabled
                  readOnly
                  value={variable}
                />
              </div>
            ) : (
              <Textarea
                placeholder="Enter Input as ENV_KEY=ENV_VALUE"
                className="resize-none font-mono"
                disabled
                readOnly
                rows={length}
                value={variable}
              />
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-4">
        <Button onClick={decryptIt} disabled={isEncrypted}>
          Decrypt File
        </Button>
        <Link
          href={
            "/workspaces/" +
            workspace +
            "/add-new-file?envFileId=" +
            results.result.id
          }
        >
          <Button
            variant="outline"
            disabled={
              !results.result.secret.org.members[0].permission.includes("write")
            }
          >
            Edit File
          </Button>
        </Link>

        <Button variant="outline">
          {/* onClick={handler} disabled={isLoading}> */}
          {/* {isLoading ? (
            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <></>
          )} */}
          Share File
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Details;
