"use client";
import { RequestResponse, RequestSuccess } from "@/middlewares/type";
import { Organization, Secret } from "database";
import React from "react";
import useSWR, { Fetcher } from "swr";

export const getFetcher: Fetcher<RequestResponse<Secret>> = (url: string) =>
  fetch(url).then((res) => res.json());

const useSecret = (
  workspace: string,
  setHasKeyFoundAlready?: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const { data, error, isLoading } = useSWR(
    "/api/secret/" + workspace,
    getFetcher,
    {
      onSuccess: () => {
        setHasKeyFoundAlready && setHasKeyFoundAlready(true);
      },
    }
  );

  return { data, error, isLoading };
};

export default useSecret;
