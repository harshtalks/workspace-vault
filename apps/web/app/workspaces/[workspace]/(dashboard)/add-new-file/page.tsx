import Workspaces from "@/app/get-started/workspaces/components/workspaces";
import { Form } from "@/components/Form";
import { Button } from "@ui/components/ui/button";
import { Separator } from "@ui/components/ui/separator";
import { Textarea } from "@ui/components/ui/textarea";
import { useSearchParams } from "next/navigation";
import React, { Suspense } from "react";
import { butBroCanYouDoShitHere } from "../overview/page";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Badge } from "@ui/components/ui/badge";
import { getEnvDataFromServer, GetEnvDataFromServer } from "@/services/env";

const page = async ({
  params,
  searchParams,
}: {
  params: { workspace: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {
  const envFileId = searchParams["envFileId"];

  let whatServerRespondedMeWithWhenIAskedForEnvData: GetEnvDataFromServer | null =
    null;

  if (typeof envFileId === "string") {
    whatServerRespondedMeWithWhenIAskedForEnvData = await getEnvDataFromServer(
      Number.parseInt(envFileId)
    );
  }

  const canDoShit = await butBroCanYouDoShitHere(params.workspace);

  return (
    <div className="hidden h-full flex-col md:flex">
      <Separator className="" />
      <Suspense
        fallback={
          <div>{<ReloadIcon className="h-4 w-4 mr-2" />}loading...</div>
        }
      >
        <div className="py-4 overflow-hidden ">
          {canDoShit.status === "error" ? (
            <div>
              <Badge variant="destructive">Error</Badge>
            </div>
          ) : (
            <Form
              canAddOrEditFile={canDoShit.addOrEditFile}
              workspace={params.workspace}
              resultFromServer={whatServerRespondedMeWithWhenIAskedForEnvData}
            />
          )}
        </div>
      </Suspense>
    </div>
  );
};

export default page;
