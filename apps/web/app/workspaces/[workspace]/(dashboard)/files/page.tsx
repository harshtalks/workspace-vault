import Deauthenticate from "@/components/globals/deauthenticate";
import React from "react";
import { DataTable } from "./components/data-table";
import { columns } from "./components/columns";
import {
  RequestError,
  RequestResponse,
  RequestSuccess,
} from "@/middlewares/type";
import { Button } from "@ui/components/ui/button";
import Link from "next/link";
import db, { environmentFiles, eq } from "database";
import ROUTES from "@/lib/routes";

async function getData(workspace: string) {
  // Fetch data from your API here.
  try {
    const envs = await db.query.environmentFiles.findMany({
      where: eq(environmentFiles.workspaceId, workspace),
    });

    return {
      status: "success" as const,
      result: envs,
    };
  } catch (error) {
    return {
      status: "error" as const,
      error: error instanceof Error ? error.message : "An error occurred",
    };
  }
}

const page = async ({ params }: { params: { workspace: string } }) => {
  const data = await getData(params.workspace);
  return (
    <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
          <p className="text-muted-foreground">
            Here&apos;s a list of your different project files under this
            workspace!
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Link
            href={ROUTES.workspaceTab({
              workspaceId: params.workspace,
              tab: "add-new-file",
            })}
          >
            <Button>Add New File</Button>
          </Link>
        </div>
      </div>
      {data.status === "success" ? (
        <DataTable data={data.result} columns={columns} />
      ) : (
        <div>Oh Shit an Error Happened.</div>
      )}
    </div>
  );
};

export default page;
