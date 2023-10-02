import Header from "@/components/globals/header";
import React, { Children } from "react";
import { Toaster } from "sonner";

type ThemeLayoutProps = {
  children: React.ReactNode;
};

const ThemeLayout = ({ children }: ThemeLayoutProps) => {
  return (
    <main className="max-w-[1300px] relative px-12 mx-auto w-full">
      <Header />
      <div className="pt-[100px]">{children}</div>
      <Toaster />
    </main>
  );
};

export default ThemeLayout;
