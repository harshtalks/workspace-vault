import * as React from "react";
import { RedisActivityForWorkspace } from "../../../../../api/members/route";
import { redisClient } from "@/store/redis";
import { WorkspaceResponse } from "@/middlewares/type";
import { Badge } from "@ui/components/ui/badge";
import ActvitiyList from "./activity-list";

// await async lol
async function fetchRecentActivitiesForTheWorkspace<TData>(
  workspace: string
): Promise<WorkspaceResponse<TData[]>> {
  try {
    const response = await redisClient.zrange<TData[]>(
      `recentActivities:${workspace}`,
      0,
      -1,
      { rev: true }
    );

    return {
      status: "success",
      result: response,
    };
  } catch (error) {
    return {
      status: "error",
      error: error instanceof Error ? error.message : "An Error Occured.",
    };
  }
}

export const WorkspaceActivities = async ({
  workspace,
}: {
  workspace: string;
}) => {
  const response =
    await fetchRecentActivitiesForTheWorkspace<RedisActivityForWorkspace>(
      workspace
    );

  return response.status === "success" ? (
    <div className="max-h-[450px] overflow-scroll pr-2">
      <ActvitiyList result={response.result} />
    </div>
  ) : (
    <div className="flex items-center justify-center py-4 w-full">
      <Badge variant="destructive">{response.error}</Badge>
    </div>
  );
};

function async<T>(url: any, string: any) {
  throw new Error("Function not implemented.");
}
