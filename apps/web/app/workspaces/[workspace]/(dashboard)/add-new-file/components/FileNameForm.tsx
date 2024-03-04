"use client";

import { getName } from "@/utils/random-name-generator";
import { GitHubLogoIcon, ReloadIcon } from "@radix-ui/react-icons";
import { Button } from "@ui/components/ui/button";
import { Input } from "@ui/components/ui/input";
import { Label } from "@ui/components/ui/label";
import { cn } from "@ui/lib/utils";
import * as React from "react";
import { experimental_useFormStatus as useFormStatus } from "react-dom";
import { submitActionToAddNewFile } from "@/actions/addEnvironmentFile";

interface FileNameProps extends React.HTMLAttributes<HTMLDivElement> {
  workspaceId: string;
}

export function FileNameForm({ className, ...props }: FileNameProps) {
  const [name, setName] = React.useState("");
  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              File
            </Label>
            <Input
              id="name"
              placeholder="E.G. Gemini Web"
              type="text"
              autoCapitalize="none"
              autoComplete="name"
              autoCorrect="off"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <SubmitButton />
          </div>
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            find unique name
          </span>
        </div>
      </div>
      <Button
        variant="outline"
        type="button"
        onClick={() => setName(getName())}
      >
        Generate a name
      </Button>
    </div>
  );
}

const SubmitButton = () => {
  return <Button type="submit">Sign In with Email</Button>;
};
