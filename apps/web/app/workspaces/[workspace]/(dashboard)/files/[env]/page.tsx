import { WorkspaceError, WorkspaceSuccess } from "@/middlewares/type";
import { currentUser } from "@clerk/nextjs";
import { Button } from "@ui/components/ui/button";
import { PrismaClient } from "database";
import React, { Suspense } from "react";
import { Await } from "./await";
import { ReloadIcon } from "@radix-ui/react-icons";
import Details from "./components/details";
import { Accessed } from "./components/accessed";

export const getEnvDataFromServer = async (env: number) => {
  const prisma = new PrismaClient();
  try {
    const file = await prisma.environmentVariables.findUniqueOrThrow({
      where: {
        id: env,
      },
      include: {
        secret: {
          include: {
            org: {
              include: {
                members: {
                  where: {
                    role: "admin",
                  },
                },
              },
            },
          },
        },
      },
    });

    prisma.$disconnect();

    return { status: "success", result: file } as WorkspaceSuccess<typeof file>;
  } catch (error) {
    return (
      error instanceof Error &&
      ({
        error: error.message,
        status: "error",
      } as WorkspaceError)
    );
  } finally {
    prisma.$disconnect();
  }
};

export type GetEnvDataFromServer = Awaited<
  ReturnType<typeof getEnvDataFromServer>
>;

export type ExtractWorkspaceSuccess<T> = T extends { status: "success" }
  ? T
  : never;

export type WhatServerPromisedMeUponTheirSuccess =
  ExtractWorkspaceSuccess<GetEnvDataFromServer>;

const Page = async ({
  params,
}: {
  params: { env: string; workspace: string };
}) => {
  const giveMeMyResult = await getEnvDataFromServer(parseInt(params.env));
  return (
    <div className="hidden h-full flex-1 flex-col space-y-8 py-8 md:flex">
      <div>
        {giveMeMyResult.status === "error" ? (
          <div className="flex items-center flex-col justify-center gap-2">
            <div className="">
              <div>
                <iframe
                  src="https://giphy.com/embed/26BRpTqZKqnJa6ZXO"
                  width="100%"
                  height="100%"
                  className="giphy-embed"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
            <div>
              <h2 className="text-2xl text-center">
                Whoops! looks like someone gave you wrong id.
              </h2>
            </div>
            <Button>Go Back</Button>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between space-y-2">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">
                  {giveMeMyResult.result.name}
                </h2>
                <p className="text-muted-foreground">
                  In the workspace:{" "}
                  <strong>{giveMeMyResult.result.secret.org.name}</strong>
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Button>Go Back</Button>
              </div>
            </div>
            <div>
              <Details
                env={params.env}
                workspace={params.workspace}
                results={giveMeMyResult}
              />
            </div>
            <div className="w-[400px]">
              <Suspense
                fallback={
                  <div className="flex items-center">
                    <ReloadIcon className="h-4 w-4 mr-2" /> loading...
                  </div>
                }
              >
                {/* @ts-ignore Async Server Components  */}
                <Accessed envId={params.env} />
              </Suspense>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
