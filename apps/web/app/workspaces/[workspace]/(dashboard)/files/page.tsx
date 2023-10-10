import Deauthenticate from "@/components/globals/deauthenticate";
import React from "react";
import { DataTable } from "./components/data-table";
import { Payment, columns } from "./components/columns";
import { SecretFiles, dummyData, payments } from "./components/data";
import {
  WorkspaceError,
  WorkspaceResponse,
  WorkspaceSuccess,
} from "@/middlewares/type";
import { EnvironmentVariables, PrismaClient } from "database";
import { Button } from "@ui/components/ui/button";
import Link from "next/link";

async function getData(workspace: string) {
  // Fetch data from your API here.
  const prisma = new PrismaClient();
  try {
    const envs = await prisma.environmentVariables.findMany({
      where: {
        secret: {
          orgId: workspace,
        },
      },
    });

    return {
      status: "success",
      result: envs,
    } as WorkspaceSuccess<EnvironmentVariables[]>;
  } catch (error) {
    return (
      error instanceof Error &&
      ({
        status: "error",
        error: error.message,
      } as WorkspaceError)
    );
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
            Here&apos;s a list of your tasks for this month!
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Link href={`workspaces/${params.workspace}/add-new-file`}>
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
