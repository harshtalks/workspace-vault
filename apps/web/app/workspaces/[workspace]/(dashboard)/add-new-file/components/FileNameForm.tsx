"use client";

import { GitHubLogoIcon, ReloadIcon } from "@radix-ui/react-icons";
import { Button } from "@ui/components/ui/button";
import { Input } from "@ui/components/ui/input";
import { Label } from "@ui/components/ui/label";
import { cn } from "@ui/lib/utils";
import * as React from "react";
import * as z from "zod";

interface FileNameProps extends React.HTMLAttributes<HTMLDivElement> {
  workspaceId: string;
}

const addFileSchema = z.object({
  name: z
    .string({
      invalid_type_error: "This is an invalid name",
    })
    .min(5, "Name must be at least 5 characters"),
});

export function FileNameForm({ className, ...props }: FileNameProps) {
  const [name, setName] = React.useState();

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form>
        <div className="grid gap-2">
          <div className="grid gap-2">
            <Label className="sr-only" htmlFor="email">
              File
            </Label>
            <Input
              id="name"
              placeholder="E.G. Gemini Web"
              type="text"
              autoCapitalize="none"
              autoComplete="name"
              autoCorrect="on"
            />
            <SubmitButton />
          </div>
        </div>
      </form>
    </div>
  );
}

const SubmitButton = () => {
  return <Button type="submit">Create new file</Button>;
};
