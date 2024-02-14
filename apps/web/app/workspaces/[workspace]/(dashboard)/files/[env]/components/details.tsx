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
import { toast } from "sonner";
import { localKeyForBrowser, secretDB } from "@/utils/local-store";
import {
  decryptTextWithAESGCM,
  generateMasterKey,
  getSalt,
} from "cryptography";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { RequestResponse } from "@/middlewares/type";
import { AccessProps } from "@/app/api/workspaces/access/route";
import { useAuth } from "@clerk/nextjs";
import copy from "copy-to-clipboard";
import { WhatServerPromisedMeUponTheirSuccess } from "@/services/env";

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

  const [isEncrypted, setIsEncrypted] = useState(false);
  const [variable, setVariable] = useState(results.result.variables);
  const [loading, setLoading] = useState(false);

  const { userId } = useAuth();

  const decryptIt = async () => {
    setLoading(true);
    try {
      await secretDB.open();

      const getMasterKey = await secretDB.secrets.get(workspace);

      if (!getMasterKey) {
        throw new Error("No key available to decrypt it.");
      }

      const encryptedSecret = getMasterKey.key;

      // encrypting..

      const localKey = await localKeyForBrowser();
      const decryptedSecret = await decryptTextWithAESGCM(
        encryptedSecret,
        localKey
      );

      const response = await fetch("/api/secret/verify-secret", {
        method: "POST",
        body: JSON.stringify({
          workspace: workspace,
          secretValue: decryptedSecret,
        }),
      });

      const responseJson: RequestResponse<boolean> = await response.json();

      if (responseJson.status === "error") {
        throw new Error(responseJson.error);
      }

      if (!process.env.NEXT_PUBLIC_SECRET_FOR_GENERATING_KEY) {
        throw new Error("Error ocurred while generating the master key.");
      }
      const masterkey = await generateMasterKey(
        decryptedSecret,
        getSalt(process.env.NEXT_PUBLIC_SECRET_FOR_GENERATING_KEY)
      );
      const decryptedText = await decryptTextWithAESGCM(variable, masterkey);

      setIsEncrypted(true);
      setVariable(decryptedText);
      copy(decryptedText);
      toast.success("Lesssgo, Decrypted envs... and copied to your clipboard");

      // api call for redis..

      const bodyForOurRedisData: AccessProps = {
        accessType: "read",
        envFileId: results.result.id,
        userId: userId,
        workspaceId: workspace,
      };

      const addToRedisMonitoring = await fetch("/api/workspaces/access", {
        method: "POST",
        body: JSON.stringify(bodyForOurRedisData),
      });

      const convertOurRedisResponseToJson: RequestResponse<boolean> =
        await addToRedisMonitoring.json();

      if (convertOurRedisResponseToJson.status === "error") {
        throw new Error(convertOurRedisResponseToJson.error);
      }

      toast.success(
        `You've read the file succesfully, and have been added to logs.`
      );
    } catch (error) {
      error instanceof Error && toast.error(error.message);
    } finally {
      setLoading(false);
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
        <Button onClick={decryptIt} disabled={loading || isEncrypted}>
          {loading ? (
            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <></>
          )}
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
          Share File
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Details;
