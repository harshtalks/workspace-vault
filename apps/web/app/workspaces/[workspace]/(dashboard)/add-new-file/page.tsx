import Workspaces from "@/app/get-started/workspaces/components/workspaces";
import { Form } from "@/components/Form";
import { Button } from "@ui/components/ui/button";
import { Separator } from "@ui/components/ui/separator";
import { Textarea } from "@ui/components/ui/textarea";
import { useSearchParams } from "next/navigation";
import React from "react";
import {
  GetEnvDataFromServer,
  getEnvDataFromServer,
} from "../files/[env]/page";

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

  return (
    <div className="hidden h-full flex-col md:flex">
      <Separator className="" />
      <div className="py-4 overflow-hidden ">
        <Form
          workspace={params.workspace}
          resultFromServer={whatServerRespondedMeWithWhenIAskedForEnvData}
        />
      </div>
    </div>
  );
};

export default page;
