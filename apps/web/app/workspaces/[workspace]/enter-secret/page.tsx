import React from "react";
import Form from "./Form";
import { cn } from "@ui/lib/utils";
import Link from "next/link";
import { Button } from "@ui/components/ui/button";
import Workspaces from "@/app/get-started/workspaces/components/workspaces";

const page = ({ params }: { params: { workspace: string } }) => {
  return (
    <div className="h-[calc(100vh-160px)] flex items-center justify-center w-full">
      <div className="w-[500px] mx-auto">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Enter your secret key
            </h1>
            <p className="text-sm text-muted-foreground">
              we will use it for generating your key.
            </p>
          </div>
          <div className={cn("grid gap-6 w-full")}>
            <div className="grid gap-2">
              <Form workspace={params.workspace} />
            </div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Secret mismatched?
                </span>
              </div>
            </div>
            <Link
              className="w-full"
              href={"/workspaces/" + params.workspace + "/generate-secret"}
            >
              <Button className="w-full" variant="outline" type="button">
                Generate new secret
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
