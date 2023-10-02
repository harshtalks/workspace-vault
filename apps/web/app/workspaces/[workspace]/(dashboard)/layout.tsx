"use client";
import { Button } from "@ui/components/ui/button";
import DashboardStateRoot from "./recoil-provider";
import TabManager from "./tab-manager";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <DashboardStateRoot>
      <div className="hidden rounded-lg border flex-col md:flex">
        <div className="flex-1 space-y-4 px-8 border-b pt-6 pb-4">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <Button>Add New File</Button>
          </div>
        </div>
        <div className="px-8 py-6">
          <TabManager>{children}</TabManager>
        </div>
      </div>
    </DashboardStateRoot>
  );
};

export default layout;
