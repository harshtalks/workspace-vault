"use client";
import React from "react";
import HeroButtons from "./hero-buttons";

const HeroContainer = () => {
  return (
    <div className="h-[85dvh] relative">
      <div className="w-full h-full flex flex-col items-center justify-center">
        <h1 className="text-7xl font-semibold">Seamless Envariable Sharing.</h1>
        <HeroButtons />
        <div className=" absolute bottom-0 mb-10 text-center max-w-[800px]">
          <p className="text-zinc-400 text-sm">
            We prioritize the security of your shared environment variables.
            Your data is encrypted from the moment you enter it, and we store it
            temporarily in a secure Redis store with limited access and
            expiration controls. We&#39;re committed to safeguarding your
            information and maintaining the highest standards of data
            protection.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HeroContainer;
