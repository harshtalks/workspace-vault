"use client";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@ui/components/ui/card";
import { Button } from "@ui/components/ui/button";
import { Input } from "@ui/components/ui/input";
import { ReloadIcon } from "@radix-ui/react-icons";
import { secrets, workspaces } from "database";
import { RequestResponse } from "@/middlewares/type";
import { toast } from "sonner";
import { getName } from "@/utils/random-name-generator";
import { useRouter } from "next/navigation";
import { randomValueGeneratorCrypto } from "cryptography";
import { UseQueryResult } from "@tanstack/react-query";

const AddWorkspace = ({
  refetch,
}: {
  refetch: UseQueryResult<any, any>["refetch"];
}) => {
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handler = async () => {
    setIsLoading(true);
    try {
      const uri = "/api/workspaces";

      const response = await fetch(uri, {
        method: "post",
        body: JSON.stringify({
          workspace: { name: name },
          secret: {
            salt: randomValueGeneratorCrypto(),
            secret: randomValueGeneratorCrypto(),
            name: getName(),
          },
        } as { workspace: typeof workspaces.$inferInsert; secret: typeof secrets.$inferInsert }),
      });

      const responseJson: RequestResponse<typeof workspaces.$inferSelect> =
        await response.json();

      if (responseJson.status === "error") {
        throw new Error(responseJson.error);
      }

      toast.success(
        `New workspace (organization) is created with name "${name}" and id "${responseJson.result.id}"`
      );

      refetch();
      setName("");
    } catch (error) {
      error instanceof Error
        ? toast.error(`${error.name}: ${error.message}`)
        : toast.error(`An error occured! Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full border-0 shadow-none">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Workspaces</CardTitle>
        <CardDescription>Access your workspaces here.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            id="text"
            type="text"
            placeholder="Create New Workspace"
          />
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex flex-col w-full">
          <Button
            onClick={handler}
            disabled={isLoading || !name}
            className="w-full"
          >
            <>
              {isLoading && (
                <ReloadIcon className="animate-spin w-4 h-4 mr-2" />
              )}
              Create Workspace
            </>
          </Button>
          <Button
            onClick={() => setName(getName())}
            variant="secondary"
            className="w-fit mt-2 text-xs"
          >
            Generate Random Name
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default AddWorkspace;
