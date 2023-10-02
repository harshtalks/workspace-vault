import Workspaces from "@/app/get-started/workspaces/components/workspaces";
import { Form } from "@/components/Form";
import { Button } from "@ui/components/ui/button";
import { Separator } from "@ui/components/ui/separator";
import { Textarea } from "@ui/components/ui/textarea";
import React from "react";

const page = ({ params }: { params: { workspace: string } }) => {
  return (
    <div className="hidden h-full flex-col md:flex">
      <Separator className="" />
      <div className="py-4">
        <Form workspace={params.workspace} />
      </div>
    </div>
  );
};

export default page;
