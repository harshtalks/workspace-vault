"use client";
import { deleteCookie, hasCookie, setCookie } from "cookies-next";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { AvatarIcon, ReloadIcon } from "@radix-ui/react-icons";
import { Button } from "@ui/components/ui/button";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

const Deauthenticate = () => {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const { isSignedIn } = useAuth();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    !isSignedIn && deleteCookie("webAuthn");
    router.refresh();
  }, [isSignedIn]);

  return isClient ? (
    hasCookie("webAuthn") ? (
      <Button
        onClick={() => {
          deleteCookie("webAuthn");
          router.push("/get-started/authenticate");
          router.refresh();
        }}
        variant="outline"
        className="p-2"
      >
        De authenticate
      </Button>
    ) : null
  ) : (
    <></>
  );
};

export default Deauthenticate;
