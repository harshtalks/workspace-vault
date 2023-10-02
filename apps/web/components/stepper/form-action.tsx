"use client";
import { Button } from "@ui/components/ui/button";
import { useRouter } from "next/navigation";
import React from "react";

const FormAction = ({
  isDisabled,
  link,
}: {
  isDisabled: boolean;
  link: string;
}) => {
  const { push } = useRouter();
  return (
    <Button
      disabled={isDisabled}
      onClick={() => {
        push(link);
      }}
      className="w-full"
    >
      Next Step
    </Button>
  );
};

export default FormAction;
