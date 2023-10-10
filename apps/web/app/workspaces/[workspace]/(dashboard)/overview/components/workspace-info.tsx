import React from "react";
import { getWorkspaceData } from "../../settings/page";
import { Badge } from "@ui/components/ui/badge";

const WorkspaceInfo = async ({ workspace }: { workspace: string }) => {
  const getDataFromServer = await getWorkspaceData(workspace);
  return getDataFromServer.status === "success" ? (
    <div className="w-full flex flex-col gap-y-2">
      <div className="flex flex-col">
        <p className="text-sm text-muted-foreground">Workspace Name</p>
        <h4>{getDataFromServer.result.name}</h4>
      </div>
      <div className="flex flex-col">
        <p className="text-sm text-muted-foreground">Workspace Id</p>
        <h4>{getDataFromServer.result.id}</h4>
      </div>
      <div className="flex flex-col">
        <p className="text-sm text-muted-foreground">Created on</p>
        <h4>
          {new Date(getDataFromServer.result.created_at).toLocaleString()}
        </h4>
      </div>
    </div>
  ) : (
    <div className="flex items-center w-full p-4">
      <Badge>{getDataFromServer.error}</Badge>
    </div>
  );
};

export default WorkspaceInfo;
