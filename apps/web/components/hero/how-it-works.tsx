import React from "react";

const HowItWorks = () => {
  return (
    <section className="block">
      <div className="px-5 md:px-10">
        <div className="mx-auto w-full max-w-3xl">
          <div className="py-12 md:py-16 lg:py-20">
            <div className="mx-auto flex-col flex max-w-3xl items-center text-center">
              <h2 className="font-bold text-3xl md:text-5xl">How it works</h2>
              <div className="mx-auto mt-4 max-w-[528px] mb-8 md:mb-12 lg:mb-16">
                <p className="text-[#636262] max-[479px]:text-sm">
                  We are aiming to provide most secure transaction possible
                  using the theoretically the most secure cryptographic
                  mechanisms.
                </p>
              </div>
            </div>
            <div className="mx-auto grid-cols-1 grid max-w-xl gap-6">
              <div className="flex-row flex items-center justify-center bg-[#f2f2f7] px-6 py-4 max-[767px]:mx-auto max-[767px]:max-w-[480px] rounded-sm">
                <div className="mr-6 flex-col flex-none flex items-center justify-center bg-white rounded-sm h-14 w-14">
                  <p className="font-bold text-sm sm:text-xl">1</p>
                </div>
                <p className="text-sm">
                  In our app, WebAuthn passkey fortifies security by ditching
                  conventional passwords, a cutting-edge authentication system
                  with public-key cryptography. You enjoy heightened protection
                  through biometrics or secure keys.
                </p>
              </div>
              <div className="flex-row flex items-center justify-center bg-[#f2f2f7] px-6 py-4 max-[767px]:mx-auto max-[767px]:max-w-[480px] rounded-sm">
                <div className="mr-6 flex-col flex-none flex items-center justify-center bg-white rounded-sm h-14 w-14">
                  <p className="font-bold text-sm sm:text-xl  ">2</p>
                </div>
                <p className="text-sm">
                  Everything is in the workspace, you create a workspace add
                  members with permissions to read or write or adding other
                  members. Each workspace is required a secret key that we use
                  to derive key for <strong>AES Cipher</strong>.
                </p>
              </div>
              <div className="flex-row flex items-center justify-center bg-[#f2f2f7] px-6 py-4 max-[767px]:mx-auto max-[767px]:max-w-[480px] rounded-sm">
                <div className="mr-6 flex-col flex-none flex items-center justify-center bg-white rounded-sm h-14 w-14">
                  <p className="font-bold text-sm sm:text-xl  ">3</p>
                </div>
                <p className="text-sm">
                  We store the hash of the secret for the workspace for the
                  future references. we use that secret for encrypting the envs
                  and decrypting the same on your own device. We provide end to
                  end encryption providing maximum security
                </p>
              </div>
              <div className="flex-row flex items-center justify-center bg-[#f2f2f7] px-6 py-4 max-[767px]:mx-auto max-[767px]:max-w-[480px] rounded-sm">
                <div className="mr-6 flex-col flex-none flex items-center justify-center bg-white rounded-sm h-14 w-14">
                  <p className="font-bold text-sm sm:text-xl  ">4</p>
                </div>
                <p className="text-sm">
                  Everytime you forget your secret key, you can't have it back
                  as we do not store your secret directly in our servers for
                  your references. We use a{" "}
                  <strong>zero knowledge proof</strong> backend for server side
                  logic. you will loose all your data in case you forget your
                  secret for a workspace. make sure you store it somewhere safe.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
