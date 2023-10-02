"use client";
import React from "react";
import Link from "next/link";
import { Button } from "@ui/components/ui/button";
import { useAuth } from "@clerk/nextjs";

const HeroButtons = () => {
  const { userId } = useAuth();
  return userId ? (
    <div className="mt-12 mb-6 flex items-center gap-4">
      <Link href="/get-started">
        <Button size="lg" className="px-12">
          Get Started
        </Button>
      </Link>
      <Link href="/dashboard">
        <Button variant="outline" size="lg" className="px-12">
          Dashboard
        </Button>
      </Link>
    </div>
  ) : (
    <div className="mt-12 mb-6 flex items-center gap-4">
      <Link href="/sign-in">
        <Button size="lg" className="px-12">
          Sign In
        </Button>
      </Link>
      <Link href="/sign-up">
        <Button variant="outline" size="lg" className="px-12">
          Sign Up
        </Button>
      </Link>
    </div>
  );
};

export default HeroButtons;
