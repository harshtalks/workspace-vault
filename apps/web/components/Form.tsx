"use client";
import * as React from "react";

import { Button } from "@ui/components/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@ui/components/card";
import { Textarea } from "@ui/components/ui/textarea";
import { Label } from "@ui/components/ui/label";
import { Input } from "ui/components/ui/input";
import Link from "next/link";
import { EyeOpenIcon, EyeNoneIcon, ReloadIcon } from "@radix-ui/react-icons";
import { ReadFile } from "./read-file";
import { atom, useRecoilState } from "recoil";
import { assertion, number, object, optional, string } from "@recoiljs/refine";
import { secretDB } from "@/utils/local-store";
import { encryptTextWithAESGCM } from "cryptography";
import { EnvAPIRequestBody } from "@/app/api/envs/route";
import { WorkspaceResponse } from "@/middlewares/type";
import { EnvironmentVariables } from "database";
import { toast } from "sonner";

export type AddNewEnvProps = {
  envariables: string;
  readLimits?: number;
  name: string;
};

const validateState = object({
  envariables: string(),
  readLimits: optional(number()),
  name: string(),
});

export function Form({ workspace }: { workspace: string }) {
  const [hideEnvs, setHideEnvs] = React.useState(false);

  const [state, setState] = useRecoilState(
    atom<AddNewEnvProps>({
      key: "AddNewFile",
      default: {
        envariables: "",
        readLimits: -1, // -1 means unlimited
        name: "",
      },
    })
  );

  const [content, setContent] = React.useState("");

  const [isLoading, setIsLoading] = React.useState(false);

  // fake value
  const length = 8;
  const fakeValue = Array.from({ length: length })
    .map((_, index) => "*".repeat(80) + (index === length - 1 ? "" : "\n"))
    .join("");

  // handler
  const handler = async () => {
    setIsLoading(true);
    try {
      // type assertion
      const assertedStateValidation = assertion(
        validateState,
        "Invalid value for the name, and env variables."
      );
      const _ = assertedStateValidation(state);

      // getting the master key
      await secretDB.open();
      const masterKey = await secretDB.secrets.get(workspace);

      if (!masterKey) {
        throw new Error("No keys were found with this workspace locally.");
      }

      // crypto work.
      const encryptedEnvs = await encryptTextWithAESGCM(
        state.envariables,
        masterKey.key
      );

      // hitting the database here:
      const hittingTheDatabase = await fetch("/api/envs", {
        method: "POST",
        body: JSON.stringify({
          envs: {
            envariables: encryptedEnvs,
            name: state.name,
            readLimits: state.readLimits,
          },
          workspace: workspace,
        } as EnvAPIRequestBody),
      });

      const responseWhenDatabaseResponded: WorkspaceResponse<EnvironmentVariables> =
        await hittingTheDatabase.json();

      if (responseWhenDatabaseResponded.status === "error") {
        throw new Error(responseWhenDatabaseResponded.error);
      }

      toast.success(
        `We have encrypted and saved your envs for future usages. id result: ${responseWhenDatabaseResponded.result.id}`
      );
    } catch (error) {
      error instanceof Error
        ? toast.error(`${error.name}: ${error.message}`)
        : toast.error(`An error occured! Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Share Variables</CardTitle>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Environment Variables</Label>
              <div className="flex  py-1 space-x-2 border outline-2 focus-visible:ring-2 focus-visible:ring-ring rounded-md overflow-auto max-h-[200px]">
                <div className="pl-2 p-0 h-full text-zinc-300 border-zinc-700">
                  {Array.from({
                    length: (hideEnvs ? fakeValue : state.envariables).split(
                      "\n"
                    ).length,
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
                  rows={Math.max(9, state.envariables.split("\n").length)}
                  value={hideEnvs ? fakeValue : state.envariables}
                  onChange={(e) => {
                    setState((state) => ({
                      ...state,
                      envariables: e.target.value,
                    }));
                  }}
                  placeholder="Enter Input as ENV_KEY=ENV_VALUE"
                  disabled={hideEnvs}
                />
              </div>

              <Button
                onClick={(e) => {
                  e.preventDefault();
                  setHideEnvs((current) => !current);
                }}
                className="w-fit text-xs"
                variant="ghost"
              >
                {hideEnvs ? (
                  <>
                    <EyeOpenIcon className="mr-2 h-4 w-4" /> visible
                  </>
                ) : (
                  <>
                    <EyeNoneIcon className="mr-2 h-4 w-4" /> hide
                  </>
                )}
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Name of the file</Label>
                <div className="flex border rounded-md overflow-hidden">
                  <Input
                    type="text"
                    min={0}
                    value={state.name}
                    onChange={(e) =>
                      setState((state) => ({
                        ...state,
                        name: e.target.value,
                      }))
                    }
                    className="border-0 focus:ring-0 focus-visible:ring-0 appearance-none"
                    id="name"
                    placeholder="Enter Name"
                    required
                  />
                </div>
                <p className="text-xs text-zinc-400">
                  Learn more about TTL{" "}
                  <Link
                    href="https://docs.aws.amazon.com/AmazonElastiCache/latest/red-ug/Strategies.html#Strategies.WithTTL"
                    target="_blank"
                    className="underline hover:text-foreground"
                  >
                    here.
                  </Link>{" "}
                  Empty Field is assumed as 24 hours
                </p>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="number_of_reads">Number of Reads</Label>
                <Input
                  type="number"
                  min={0}
                  value={state.readLimits}
                  onChange={(e) =>
                    setState((state) => ({
                      ...state,
                      readLimits: +e.target.value,
                    }))
                  }
                  id="number_of_reads"
                  className="appearance-none"
                  placeholder="Enter number of reads"
                />
                <p className="text-xs text-zinc-400 ">
                  The number of times this variable can be read, it will expire
                  once it reaches zero. leave it empty for limitless reads
                  within TTL
                </p>
              </div>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex gap-4">
        <Button onClick={handler} disabled={isLoading}>
          {isLoading ? (
            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <></>
          )}
          Save File
        </Button>
        <ReadFile setHideEnvs={setHideEnvs} setContent={setContent} />
      </CardFooter>
    </Card>
  );
}
