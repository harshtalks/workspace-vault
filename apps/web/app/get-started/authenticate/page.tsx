import { Button } from "@ui/components/ui/button";
import { cn } from "@ui/lib/utils";
import React from "react";
import ActionHandler from "./action-handler";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const Page = () => {
  return (
    <div className="h-[calc(100vh-160px)] flex items-center  justify-center w-full">
      <div className="">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              MFA Using WebAuth
            </h1>
            <p className="text-sm text-muted-foreground">
              Autnenticate yourself to continue using our services.
            </p>
          </div>
          <div className={cn("grid gap-6")}>
            <div className="grid gap-2">
              <ActionHandler />
            </div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  No Account?
                </span>
              </div>
            </div>
            <Link className="w-full" href="/get-started">
              <Button className="w-full" variant="outline" type="button">
                Register now
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
