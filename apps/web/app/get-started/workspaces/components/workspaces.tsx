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
import useWorkspaces from "@/hooks/use-workspaces";
import { Skeleton } from "@ui/components/ui/skeleton";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Workspaces = () => {
  const { data, error, isLoading } = useWorkspaces();
  const [isRouting, setIsRouting] = useState<string>();

  return (
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
                window.location.reload();
              }}
              variant="ghost"
              size="sm"
            >
              <ReloadIcon />
            </Button>
          </div>
          {isLoading ? (
            <div className="grid gap-6">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="flex w-full items-stretched justify-between space-x-4"
                >
                  <div className="flex flex-col gap-2">
                    <Skeleton className="w-[250px] h-8" />
                    <Skeleton className="w-[200px] h-4" />
                  </div>
                  <Skeleton className="w-[150px] h-12" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid gap-6">
              {data.result.map((workspace) => (
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
                        {new Date(workspace.created_at).toDateString()}
                      </p>
                    </div>
                  </div>
                  <Link href={`/workspaces/${workspace.id}/generate-secret`}>
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
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default Workspaces;
