import { Button } from "@ui/components/ui/button";
import { Input } from "@ui/components/ui/input";
import React from "react";

const CTA = () => {
  return (
    <section className="block">
      <div className="px-5 md:px-10">
        <div className="mx-auto w-full max-w-7xl">
          <div className="py-16 md:py-24 lg:py-32">
            <div className="mx-auto w-full max-w-3xl">
              <div className="text-center">
                <div className="mb-6 max-[991px]:mx-auto max-[991px]:max-w-[720px] md:mb-10 lg:mb-12">
                  <h2 className="mb-4 text-3xl font-bold md:text-5xl">
                    Lightning Fast&nbsp;Webflow Dev Made Easy
                  </h2>
                  <div className="mx-auto max-w-[630px]">
                    <p className="text-[#636262] max-[479px]:text-sm">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit ut
                      aliquam, purus sit amet luctus venenatis, lectus magna
                      fringilla urna
                    </p>
                  </div>
                </div>
                <div className="mx-auto mb-4 flex max-w-[560px] flex-col items-center justify-center">
                  <form
                    name="email-form"
                    method="get"
                    className="relative font-mono gap-2 w-full max-w-[80%] flex-col flex items-center justify-center"
                  >
                    <Input
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                    />
                    <Button className="w-full">Submit</Button>
                    <div></div>
                    <div></div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
