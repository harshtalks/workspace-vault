import React from "react";
import AddWorkspace from "./components/add-workspace";
import Workspaces from "./components/workspaces";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Workspaces",
  description: "list of all your workspaces.",
};

const Page = () => {
  return (
    <div className="w-2/5 mx-auto min-h-[calc(100vh-100px)] flex-col flex items-center justify-center">
      <AddWorkspace />
      <Workspaces />
    </div>
  );
};

export default Page;
