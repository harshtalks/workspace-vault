import React from "react";
import {
  GitHubLogoIcon,
  LinkedInLogoIcon,
  InstagramLogoIcon,
} from "@radix-ui/react-icons";
import { Separator } from "@ui/components/ui/separator";

const Footer = () => {
  return (
    <footer className="block">
      <Separator />
      <div className="px-5 md:px-10">
        <div className="mx-auto w-full max-w-7xl">
          <div className="py-16 md:py-24 lg:py-32">
            <div className="flex-col flex items-center">
              <p className="text-4xl font-mono mb-8 inline-block max-w-full">
                Blazingly fast environment variable sharing
              </p>
              <div className="text-center font-semibold max-[991px]:ml-0 max-[991px]:mr-0 max-[991px]:py-1">
                <a
                  href="#"
                  className="inline-block px-6 py-2 font-normal transition hover:text-[#d6a701]"
                >
                  About
                </a>
                <a
                  href="#"
                  className="inline-block px-6 py-2 font-normal transition hover:text-[#d6a701]"
                >
                  Features
                </a>
                <a
                  href="#"
                  className="inline-block px-6 py-2 font-normal transition hover:text-[#d6a701]"
                >
                  Works
                </a>
                <a
                  href="#"
                  className="inline-block px-6 py-2 font-normal transition hover:text-[#d6a701]"
                >
                  Support
                </a>
                <a
                  href="#"
                  className="inline-block px-6 py-2 font-normal transition hover:text-[#d6a701]"
                >
                  Help
                </a>
              </div>
              <Separator className="mt-4 mb-8 w-1/2 mx-auto" />
              <div className="mb-12 grid-cols-3 grid-flow-col grid w-full max-w-[208px] gap-3">
                <a
                  href="#"
                  className="mx-auto flex-col flex max-w-[24px] items-center justify-center"
                >
                  <GitHubLogoIcon className="h-6 w-6" />
                </a>
                <a
                  href="#"
                  className="mx-auto flex-col flex max-w-[24px] items-center justify-center"
                >
                  <LinkedInLogoIcon className="h-6 w-6" />
                </a>
                <a
                  href="#"
                  className="mx-auto flex-col flex max-w-[24px] items-center justify-center"
                >
                  <InstagramLogoIcon className="h-6 w-6" />
                </a>
              </div>
              <p className="max-[479px]:text-sm">
                © Copyright 2023. Made with love and help from stackoverflow.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
