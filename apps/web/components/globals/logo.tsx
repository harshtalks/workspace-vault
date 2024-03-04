import Image from "next/image";
import React from "react";

const Logo = () => {
  return (
    <>
      <Image
        src="/tokenstack-white.png"
        width={200}
        height={20}
        alt="logo"
        unoptimized
        className="dark:hidden"
      />
      <Image
        src="/tokenstack-dark.png"
        width={200}
        height={20}
        alt="logo"
        unoptimized
        className="hidden dark:block"
      />
    </>
  );
};

export default Logo;
