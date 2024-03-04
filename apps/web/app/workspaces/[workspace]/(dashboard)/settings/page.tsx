import { getWorkspaceData } from "@/async/workspaceData";
import { Badge } from "@ui/components/ui/badge";
import { Button } from "@ui/components/ui/button";
import { Input } from "@ui/components/ui/input";
import { Separator } from "@ui/components/ui/separator";
import React from "react";

const page = async ({ params }: { params: { workspace: string } }) => {
  const dataFromServer = await getWorkspaceData(params.workspace);
  return dataFromServer.status === "success" && dataFromServer.result ? (
    <div className="hidden space-y-6 pb-16 md:block">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your workspace settings and set workspace preferences here.
        </p>
      </div>
      <Separator className="my-6" />
      <div className="flex flex-col gap-8 max-w-[700px]">
        <div className="flex flex-col gap-2">
          <h6 className="font-semibold">Change the Workspace Name</h6>
          <Input
            type="text"
            className="w-[300px]"
            placeholder="Enter the workspace Name"
            value={dataFromServer.result.name}
          />
          <div className="flex items-center gap-x-4">
            <Button className="w-fit">Update</Button>
            <Button className="w-fit" variant="secondary">
              Generate Random Name
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            This is your public display name. It can be your real name or a
            pseudonym. You can only change this once every 30 days.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <h6 className="font-semibold">Delete All the env files</h6>
          <Button className="w-fit" variant="destructive">
            Delete env files
          </Button>
          <p className="text-sm text-muted-foreground">
            This is your public display name. It can be your real name or a
            pseudonym. You can only change this once every 30 days.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <h6 className="font-semibold">Delete The Workspace</h6>
          <Button className="w-fit" variant="destructive">
            Delete workspace
          </Button>
          <p className="text-sm text-muted-foreground">
            This is your public display name. It can be your real name or a
            pseudonym. You can only change this once every 30 days.
          </p>
        </div>
      </div>
    </div>
  ) : (
    <div className="flex items-center p-4 justify-center">
      <Badge variant="destructive">{dataFromServer.error}</Badge>
    </div>
  );
};

export default page;
