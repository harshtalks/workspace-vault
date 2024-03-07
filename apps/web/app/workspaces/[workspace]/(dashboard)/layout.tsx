"use client";
import { Button } from "@ui/components/ui/button";
import DashboardStateRoot from "./recoil-provider";
import TabManager from "./tab-manager";

const layout = ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { workspace: string };
}) => {
  return (
    <DashboardStateRoot>
      <div className="flex-1 space-y-4 border-b pt-6 pb-4">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        </div>
      </div>
      <div className="py-6">
        <TabManager>{children}</TabManager>
      </div>
    </DashboardStateRoot>
  );
};

export default layout;
