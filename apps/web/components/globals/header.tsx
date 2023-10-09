//
import Link from "next/link";
import React from "react";
import ToggleTheme from "./toggle-theme";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { UserButton } from "@clerk/nextjs";
import Deauthenticate from "./deauthenticate";

const Header = () => {
  return (
    <div className="border-b fixed bg-white dark:bg-background left-0 z-10 top-0 w-full">
      <div className="mx-auto py-4 flex justify-between items-center px-8">
        <Link href="/" className="font-bold text-2xl">
          Workspace<span className="text-zinc-400">Vault</span>
        </Link>
        <div className="flex items-center gap-4">
          <Deauthenticate />
          <UserButton afterSignOutUrl="/" />
          <ToggleTheme />
          <Link href="/">
            <GitHubLogoIcon className="h-6 w-6" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Header;
