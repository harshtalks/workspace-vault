import React from "react";
import { getWorkspaceData } from "../../settings/page";
import { Badge } from "@ui/components/ui/badge";
import { roleEnum } from "database";

const WorkspaceInfo = async ({ workspace }: { workspace: string }) => {
  const getDataFromServer = await getWorkspaceData(workspace);
  return getDataFromServer.status === "success" ? (
    <div className="w-full flex flex-col gap-y-2">
      <div className="flex flex-col">
        <p className="text-sm text-muted-foreground">Workspace Name</p>
        <h4>{getDataFromServer.result.name}</h4>
      </div>
      <div className="flex flex-col space-y-1">
        <p className="text-sm text-muted-foreground">Workspace Id</p>
        <Badge variant="secondary" className="text-xs w-fit font-medium">
          {getDataFromServer.result.id}
        </Badge>
      </div>
      <div className="flex flex-col">
        <p className="text-sm text-muted-foreground">Created on</p>
        <h4>
          {new Date(getDataFromServer.result.createdAt).toLocaleString(
            undefined,
            {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "numeric",
              minute: "2-digit",
              timeZoneName: "shortOffset",
            }
          )}
        </h4>
      </div>
      <div className="flex flex-col space-y-1">
        <p className="text-sm text-muted-foreground">Total Members</p>
        <div className="flex items-center gap-2 flex-wrap">
          {roleEnum.enumValues.map((el) => (
            <Badge
              variant="secondary"
              key={el}
              className="flex w-fit items-center gap-1 rounded-lg"
            >
              <p className="text-sm text-muted-foreground">{el}</p>
              <h6 className="text-sm">
                {
                  getDataFromServer.result.members.filter((l) => l.role === el)
                    .length
                }
              </h6>
            </Badge>
          ))}
        </div>
      </div>
    </div>
  ) : (
    <div className="flex items-center w-full p-4">
      <Badge>{getDataFromServer.error}</Badge>
    </div>
  );
};

export default WorkspaceInfo;
