import React, { Suspense } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@ui/components/ui/card";
import Members from "./components/members";
import { Button } from "@ui/components/ui/button";
import { Separator } from "@ui/components/ui/separator";
import AddMembers from "./components/add-members";
import { WorkspaceActivities } from "./components/workspace-activities";
import { ReloadIcon } from "@radix-ui/react-icons";
import WorkspaceInfo from "./components/workspace-info";
import Link from "next/link";
import { Badge } from "@ui/components/ui/badge";
import ROUTES from "@/lib/routes";
import { butBroCanYouDoShitHere } from "@/async/validateUserAccess";

const page = async ({ params }: { params: { workspace: string } }) => {
  const canYouDoAnythingFR = await butBroCanYouDoShitHere(params.workspace);

  return (
    <div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Environment Files
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">19</div>
            <p className="text-xs text-muted-foreground">5 added this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reads</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">400</div>
            <p className="text-xs text-muted-foreground">40 times this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              WebAuth Devices Allowed
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">3 added this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Environment Files
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">19</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-3 gap-4 py-4">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Workspace Members</CardTitle>
            <CardDescription>
              <>
                <p>Members in the workspaces.</p>
                <div className="py-2">
                  <Suspense
                    fallback={
                      <div>
                        {<ReloadIcon className="h-4 w-4 mr-2" />}loading...
                      </div>
                    }
                  >
                    {canYouDoAnythingFR.status === "error" ? (
                      <div>
                        <Badge variant="destructive">Error</Badge>
                      </div>
                    ) : (
                      <AddMembers
                        canAddMember={canYouDoAnythingFR.addUser}
                        workspace={params.workspace}
                      />
                    )}
                  </Suspense>
                </div>
                <Separator />
              </>
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* @ts-expect-error React Server Componenets  */}
            <Members workspace={params.workspace} />
          </CardContent>
        </Card>
        <Card className="col-span-1">
          <CardHeader>
            <h2 className="font-semibold text-xl">Recent Activities</h2>
            <Separator />
          </CardHeader>
          <CardContent>
            <Suspense
              fallback={
                <div className="flex items-center justify-center">
                  <ReloadIcon className="h-4 w-4 mr-2 animate-spin" />{" "}
                  loading...
                </div>
              }
            >
              {/* @ts-ignore Async Server Components */}
              <WorkspaceActivities workspace={params.workspace} />
            </Suspense>
          </CardContent>
        </Card>
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Workspace Information</CardTitle>
            <CardDescription>
              <p>Complete workspace information available here...</p>
              <Separator className="mt-2" />
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense
              fallback={
                <div className="flex items-center w-full p-4">
                  <ReloadIcon className="h-4 w-4 mr-2" />
                  <p>loading....</p>
                </div>
              }
            >
              {/* @ts-ignore Async Server Component */}
              <WorkspaceInfo workspace={params.workspace} />
            </Suspense>
          </CardContent>
          <CardFooter>
            <Link
              href={ROUTES.workspaceTab({
                workspaceId: params.workspace,
                tab: "settings",
              })}
            >
              <Button variant="secondary">Edit workspace settings</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default page;
