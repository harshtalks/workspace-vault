"use client";
import { WorkspaceSuccess } from "@/middlewares/type";
import { Organization } from "database";
import React from "react";
import useSWR, { Fetcher } from "swr";

export const getFetcher: Fetcher<WorkspaceSuccess<Organization[]>> = (
  url: string
) => fetch(url).then((res) => res.json());

const useWorkspaces = () => {
  const { data, error, isLoading } = useSWR("/api/workspaces", getFetcher);

  return { data, error, isLoading };
};

export default useWorkspaces;
