import React from "react";
import AddWorkspace from "./components/add-workspace";
import Workspaces from "./components/workspaces";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Workspaces",
  description: "list of all your workspaces.",
};

const Page = () => {
  return <Workspaces />;
};

export default Page;
