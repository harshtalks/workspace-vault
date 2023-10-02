import { cn } from "@ui/lib/utils";
import React from "react";

import { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@ui/components/ui/button";
import GenerateKey from "@/components/stepper/generate-key";

import { currentUser } from "@clerk/nextjs";
import type { User } from "@clerk/nextjs/api";
import { secretDB } from "@/utils/local-store";
import WrapperForGeneratingKey from "@/components/stepper/generate-key-wrapper";

export const metadata: Metadata = {
  title: "Authentication",
  description: "Authentication forms built using the components.",
};

export default async function AuthenticationPage({
  params,
}: {
  params: { workspace: string };
}) {
  const user: User | null = await currentUser();

  return (
    <div className="container pt-24 relative hidden h-[600px] flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
        <div className="absolute inset-0  dark:bg-zinc-900" />
        <div className="relative z-20 mt-auto">
          <h1 className="text-4xl text-zinc-900 dark:text-white">
            {user && `Welcome, ${user.username}`}
          </h1>
          <footer className="text-sm text-zinc-900 dark:text-white">
            Please generate your secret key to proceed.
          </footer>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Create a Secret Key
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your secret key below to proceed further.
            </p>
          </div>
          <WrapperForGeneratingKey workspace={params.workspace} />
          <p className="px-8 text-center text-sm text-muted-foreground">
            By clicking continue, you agree to our{" "}
            <Link
              href="/terms"
              className="underline underline-offset-4 hover:text-primary"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="underline underline-offset-4 hover:text-primary"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
