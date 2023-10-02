"use client";
import React from "react";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@ui/components/ui/tabs";
import { DashboardTab } from "@/store/atom";
import { usePathname } from "next/navigation";
import Link from "next/link";

const states: DashboardTab[] = [
  "overview",
  "add-new-file",
  "files",
  "settings",
];

const TabManager = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const workspaceIdMatch = pathname.match(/^\/workspaces\/([^\/]+)/);
  const workspaceId = workspaceIdMatch ? workspaceIdMatch[1] : null;

  return (
    <Tabs value={pathname.split("/").pop() || "overview"} className="space-y-4">
      <TabsList>
        {states.map((current) => (
          <Link key={current} href={`/workspaces/${workspaceId}/${current}`}>
            <TabsTrigger value={current}>
              {current
                .split("-")
                .map((el) => el[0].toUpperCase() + el.slice(1))
                .join(" ")}
            </TabsTrigger>
          </Link>
        ))}
      </TabsList>
      <TabsContent
        value={pathname.split("/").pop() || "overview"}
        className="space-y-4"
      >
        <div>{children}</div>
      </TabsContent>
    </Tabs>
  );
};

export default TabManager;
