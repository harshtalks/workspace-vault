import { Button, buttonVariants } from "@ui/components/ui/button";
import { cn } from "@ui/lib/utils";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FileNameForm } from "./components/FileNameForm";
import { LeftSideInformationCard } from "./components/LeftSideCard";
import { validateRequest } from "@/lib/auth/auth";
import { butBroCanYouDoShitHere } from "@/async/validateUserAccess";
import ROUTES from "@/lib/routes";

export const metadata: Metadata = {
  title: "Authentication",
  description: "Authentication forms built using the components.",
};

export default async function AuthenticationPage({
  params,
}: {
  params: { workspace: string };
}) {
  const hasWriteAccess = await butBroCanYouDoShitHere(params.workspace);

  const canYouAdd =
    hasWriteAccess.status === "success" && hasWriteAccess.addOrEditFile;

  return (
    <>
      <div className="container relative hidden flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="relative hidden h-full flex-col bg-muted p-10 lg:flex dark:border-r">
          <div className="absolute inset-0 bg-zinc-100 rounded-lg" />
          <div className="relative z-20 mt-auto">
            <LeftSideInformationCard />
          </div>
        </div>
        {canYouAdd ? (
          <div className="lg:p-8">
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
              <div className="flex flex-col space-y-2 text-center">
                <h1 className="text-2xl font-semibold tracking-tight">
                  Create a file
                </h1>
                <p className="text-sm text-muted-foreground">
                  Here a file is equivalent to a project, you can have multiple
                  projects inside a workspace depending on your current
                  spendings.
                </p>
              </div>

              <FileNameForm workspaceId={params.workspace} />

              <p className="px-8 text-center text-sm text-muted-foreground">
                All your environment files are end to end encrypted with
                AES-256. You can read more about our protection protocol{" "}
                <Link
                  href="/privacy"
                  className="underline underline-offset-4 hover:text-primary"
                >
                  here
                </Link>
                .
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center flex flex-col items-center justify-center gap-2 sm:w-[350px] mx-auto">
            <p className="text-sm text-muted-foreground">
              You do not have permission to add or edit files in this workspace.
              Please contact the owner of the workspace to get the permissions
            </p>
            <Link
              href="/workspaces/[workspace]/overview"
              as={ROUTES.workspaceTab({
                workspaceId: params.workspace,
                tab: "overview",
              })}
            >
              <Button size="sm">Go back to overview</Button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
