"use client";
import { secretDB } from "@/utils/local-store";
import { redirect, useRouter } from "next/navigation";
import React, { createContext, useEffect } from "react";
import { toast } from "sonner";

const ContextForTheKeysExistence = createContext({});

const AlreadyKeyIsThere = ({
  children,
  workspace,
  linkToForwardTo,
  doWeWantToTakeItToTheGenerateSecretPage = true,
}: {
  children: React.ReactNode;
  workspace: string;
  linkToForwardTo: string;
  doWeWantToTakeItToTheGenerateSecretPage?: boolean;
}) => {
  const router = useRouter();
  useEffect(() => {
    const id = toast.loading("async stuff to keep you sync...");
    const checkIfOurIndexDBHasIt = async () => {
      await secretDB.open();

      const getThatKeyussy = await secretDB.secrets.get(workspace);

      if (doWeWantToTakeItToTheGenerateSecretPage) {
        !getThatKeyussy && router.push(linkToForwardTo);
      } else {
        getThatKeyussy && router.push(linkToForwardTo);
      }
    };

    checkIfOurIndexDBHasIt().then(() => toast.dismiss(id));
  }, []);
  return (
    <ContextForTheKeysExistence.Provider value={{}}>
      {children}
    </ContextForTheKeysExistence.Provider>
  );
};

export default AlreadyKeyIsThere;
