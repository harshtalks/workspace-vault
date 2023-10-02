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
import { Input } from "@ui/components/ui/input";
import { Label } from "@ui/components/ui/label";
import { Textarea } from "@ui/components/ui/textarea";
import React, { useState } from "react";
import { WhatServerPromisedMeUponTheirSuccess } from "../page";
import { toast } from "sonner";
import { secretDB } from "@/utils/local-store";
import { decryptTextWithAESGCM } from "cryptography";

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
  const length = 9;
  const fakeValue = Array.from({ length: length })
    .map((_, index) => "*".repeat(80) + (index === length - 1 ? "" : "\n"))
    .join("");

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
        <CardTitle>Shared Variables</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid w-full items-center gap-4">
          <div className="flex flex-col space-y-1.5">
            {isEncrypted ? (
              <div className="flex  py-1 space-x-2 border outline-2 focus-visible:ring-2 focus-visible:ring-ring rounded-md overflow-auto max-h-[200px]">
                <div className="pl-2 p-0 h-full text-zinc-300 border-zinc-700">
                  {Array.from({
                    length: variable.split("\n").length,
                  }).map((_, _index) => (
                    <React.Fragment key={_index}>
                      <p className="text-sm pr-2 border-r-2 font-semibold">
                        {(_index + 1).toString().padStart(2, "0")}
                      </p>
                    </React.Fragment>
                  ))}
                </div>
                <Textarea
                  className="w-full h-full appearance-none resize-none m-0 text-sm focus-visible:ring-0 rounded-0 outline-0 p-0 ring-0 border-0"
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
                className="resize-none"
                disabled
                readOnly
                rows={9}
                value={variable}
              />
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-4">
        <Button onClick={decryptIt} disabled={isEncrypted}>
          Encrypt File
        </Button>
        <Button variant="outline">
          {/* onClick={handler} disabled={isLoading}> */}
          {/* {isLoading ? (
            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <></>
          )} */}
          Edit File
        </Button>
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
