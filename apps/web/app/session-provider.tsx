"use client";
import { Session, User } from "lucia";
import { ReactNode, createContext, use } from "react";

export type ClientSessionProps = {
  user: User | null;
  session: Session | null;
};

const ClientSession = createContext<ClientSessionProps | null>(null);

export const ClientSessionProvider = ({
  children,
  initialData,
}: {
  children: ReactNode;
  initialData: ClientSessionProps;
}) => {
  return (
    <ClientSession.Provider value={initialData}>
      {children}
    </ClientSession.Provider>
  );
};

export const useAuth = () => {
  const data = use(ClientSession);

  if (!data) {
    throw new Error("useAuth must be used within a <ClientSessionProvider/>");
  }

  return data;
};
