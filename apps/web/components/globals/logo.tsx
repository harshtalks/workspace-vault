import Image from "next/image";
import React from "react";

const Logo = () => {
  return (
    <Image
      src="/tokenstack-white.png"
      width={200}
      height={20}
      alt="logo"
      unoptimized
    />
  );
};

export default Logo;
