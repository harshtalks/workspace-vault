"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@ui/components/ui/card";
import { Input } from "@ui/components/ui/input";
import { Button } from "@ui/components/ui/button";
import { Separator } from "@ui/components/ui/separator";
import { ReloadIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { Badge } from "@ui/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { workspaces } from "database";
import {
  RequestError,
  RequestResponse,
  RequestSuccess,
} from "@/middlewares/type";
import { cn } from "@ui/lib/utils";
import ComponentsSkeleton from "./ComponentsSkeleton";
import AddWorkspace from "./add-workspace";
import ROUTES from "@/lib/routes";

const Workspaces = () => {
  const {
    data,
    error,
    isLoading,
    isError,
    refetch,
    isRefetching,
    isRefetchError,
    status,
  } = useQuery<RequestResponse<(typeof workspaces.$inferSelect)[]>>({
    queryKey: ["workspaces"],
    queryFn: () => fetch("/api/workspaces").then((res) => res.json()),
  });

  const [isRouting, setIsRouting] = useState<string>();

  return (
    <div className="w-2/5 mx-auto min-h-[calc(100vh-100px)] flex-col flex items-center justify-center">
      <AddWorkspace refetch={refetch} />
      <Card className="border-0 w-full shadow-none">
        <CardHeader>
          <CardTitle className="flex space-x-2 items-end">
            <p>Got an invite?</p>
            <p className="px-2 p-1 text-[10px] bg-zinc-900 text-white dark:text-zinc-900 dark:bg-white">
              Coming Soon
            </p>
          </CardTitle>
          <CardDescription>Enter the code to join the team</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Input disabled value="Code..." />
            <Button variant="secondary" className="shrink-0">
              Enter
            </Button>
          </div>
          <Separator className="my-4" />

          <div className="space-y-4">
            <div className="flex space-x-[2px] items-center">
              <h4 className="text-lg font-medium">Existing Workspaces</h4>
              <Button
                onClick={() => {
                  refetch();
                }}
                variant="ghost"
                size="sm"
                disabled={isRefetching || isLoading}
              >
                <ReloadIcon
                  className={cn(
                    isLoading || isRefetching ? "animate-spin" : "animate-none"
                  )}
                />
              </Button>
            </div>
            {isLoading || isRefetching ? (
              <ComponentsSkeleton />
            ) : isError || isRefetchError ? (
              <div className="flex items-center justify-center p-4">
                <Badge variant="destructive">{error.message}</Badge>
              </div>
            ) : data && data.status === "success" ? (
              <div className="grid gap-6">
                {data.result.length ? (
                  data.result
                    .sort(
                      (a, b) =>
                        new Date(b.createdAt!).getTime() -
                        new Date(a.createdAt!).getTime()
                    )
                    .map((workspace) => (
                      <div
                        key={workspace.id}
                        className="flex items-center justify-between space-x-4"
                      >
                        <div className="flex items-center space-x-4">
                          <div>
                            <p className="text-sm font-medium leading-none">
                              {workspace.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(workspace.createdAt!).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <Link
                          href={ROUTES.workspaceTab({
                            workspaceId: workspace.id,
                            tab: "overview",
                          })}
                        >
                          <Button
                            onClick={() => setIsRouting(workspace.id)}
                            disabled={isRouting === workspace.id}
                          >
                            <>
                              {isRouting === workspace.id && (
                                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                              )}
                              Select
                            </>
                          </Button>
                        </Link>
                      </div>
                    ))
                ) : (
                  <div>No existing workspace found.</div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center p-4">
                <Badge variant="destructive">{data?.error}</Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Workspaces;
