"use client";
import { Button } from "@ui/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@ui/components/ui/dialog";
import { Input } from "@ui/components/ui/input";

import useSWRImmutable from "swr/immutable";
import { useState } from "react";
import { OrgMember, Role, User } from "database";
import { WorkspaceResponse } from "@/middlewares/type";
import { Avatar, AvatarFallback, AvatarImage } from "@ui/components/ui/avatar";
import { Fetcher } from "swr";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@ui/components/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@ui/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@ui/components/ui/popover";
import { Separator } from "@ui/components/ui/separator";
import { ChevronDownIcon, ReloadIcon } from "@radix-ui/react-icons";
import { Badge } from "@ui/components/ui/badge";
import { Switch } from "@ui/components/ui/switch";
import { ScrollArea } from "@ui/components/ui/scroll-area";
import { cn } from "@ui/lib/utils";
import { toast } from "sonner";

const commandItems = [
  {
    value: "dev",
    name: "developer",
    label: "Can edit and view the workspace files.",
  },
  {
    value: "qa",
    name: "QA Bro",
    label: "Can view the workspace files.",
  },
  {
    value: "admin",
    name: "Admin",
    label: "Can add user, edit and view the workspace files.",
  },
];

export type MembersToAdd = {
  id: string;
  role: Role;
};

const fetcher: Fetcher<WorkspaceResponse<User[]>> = (key: string) =>
  fetch(key).then((res) => res.json());

export default function AddMembers({ workspace }: { workspace: string }) {
  // member search
  const [memberEmail, setMemberEmail] = useState("");
  const [membersToAdd, setMembersToAdd] = useState<MembersToAdd[]>([]);
  const [isPublishing, setIsPublishing] = useState(false);

  const {
    isLoading,
    data: users,
    error,
  } = useSWRImmutable(
    memberEmail !== ""
      ? `http://localhost:3000/api/users/search?email=${memberEmail}&workspace=${workspace}`
      : null,
    fetcher
  );

  const handler = async () => {
    setIsPublishing(true);
    try {
      const fetchingResponseFromTheServer = await fetch("/api/members", {
        method: "POST",
        body: JSON.stringify({
          data: membersToAdd,
          workspace: workspace,
        }),
      });

      const serverResponse: WorkspaceResponse<OrgMember[]> =
        await fetchingResponseFromTheServer.json();

      if (serverResponse.status === "error") {
        throw new Error(serverResponse.error);
      }

      setMembersToAdd([]);
      setMemberEmail("");
      return serverResponse.result;
    } catch (error) {
      throw error;
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add Members</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] p-0 border-none">
        <Card>
          <CardHeader>
            <CardTitle>Add Members</CardTitle>
            <CardDescription>
              Anyone with member access can read the envs.
            </CardDescription>
          </CardHeader>
          <CardContent className="shadow-none">
            <Input
              value={memberEmail}
              onChange={(e) => setMemberEmail(e.target.value)}
              placeholder="user email i.e. harsh@abc.com"
            />
            <Separator className="my-4" />
            <div className="space-y-4">
              {isLoading ? (
                <div className="flex items-center justify-center p-4">
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                  loading...
                </div>
              ) : error ||
                (users &&
                  users.status === "success" &&
                  users.result.length > 0) ? (
                <>
                  <h4 className="text-sm font-medium">Found Users</h4>
                  <ScrollArea
                    className={cn(
                      "w-full ",
                      users.status === "success" && users.result.length > 5
                        ? "h-[300px]"
                        : "h-fit"
                    )}
                  >
                    <div className="grid gap-6 pr-4">
                      {users.status === "success" &&
                        users.result.map((user) => {
                          return (
                            <div
                              key={user.id}
                              className="flex items-center justify-between space-x-4"
                            >
                              <div className="flex items-center space-x-4">
                                <Switch
                                  checked={
                                    !!membersToAdd?.find(
                                      (el) => el.id === user.id
                                    )
                                  }
                                  onCheckedChange={(forReal) => {
                                    setMembersToAdd((prevMembersToAdd) => {
                                      return forReal
                                        ? [
                                            ...prevMembersToAdd,
                                            { id: user.id, role: "dev" },
                                          ]
                                        : prevMembersToAdd.filter(
                                            (el) => el.id !== user.id
                                          );
                                    });
                                  }}
                                />
                                <Avatar className="h-9 w-9">
                                  <AvatarImage
                                    src={user.avatar}
                                    alt={user.firstName}
                                  />
                                  <AvatarFallback>
                                    {user.firstName[0].toUpperCase() +
                                      user.lastName[0].toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="text-sm font-medium leading-none">
                                    {user.email}
                                  </p>
                                  <p className="text-sm capitalize text-muted-foreground">
                                    {user.firstName + " " + user.lastName}
                                  </p>
                                </div>
                              </div>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button variant="outline" className="ml-auto">
                                    {membersToAdd.find(
                                      (el) => el.id === user.id
                                    )?.role || "Permission"}
                                    <ChevronDownIcon className="ml-2 h-4 w-4 text-muted-foreground" />
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="p-0" align="end">
                                  <Command>
                                    <CommandInput placeholder="Select new role..." />
                                    <CommandList>
                                      <CommandEmpty>
                                        No roles found.
                                      </CommandEmpty>
                                      <CommandGroup>
                                        {commandItems.map((command, index) => (
                                          <CommandItem
                                            key={index}
                                            onSelect={(value) => {
                                              setMembersToAdd(
                                                (prevMembersToAdd) => {
                                                  const existingMemberIndex =
                                                    prevMembersToAdd.findIndex(
                                                      (el) => el.id === user.id
                                                    );

                                                  const updatedMembersToAdd =
                                                    existingMemberIndex !== -1
                                                      ? [
                                                          ...prevMembersToAdd.slice(
                                                            0,
                                                            existingMemberIndex
                                                          ),
                                                          {
                                                            id: user.id,
                                                            role: value as Role,
                                                          }, // Update the role as needed
                                                          ...prevMembersToAdd.slice(
                                                            existingMemberIndex +
                                                              1
                                                          ),
                                                        ]
                                                      : [
                                                          ...prevMembersToAdd,
                                                          {
                                                            id: user.id,
                                                            role: "dev" as Role,
                                                          },
                                                        ];

                                                  return updatedMembersToAdd;
                                                }
                                              );
                                            }}
                                            value={command.value}
                                            className="teamaspace-y-1 cursor-pointer flex flex-col items-start px-4 py-2"
                                          >
                                            <p>{command.name}</p>
                                            <p className="text-sm text-muted-foreground">
                                              {command.label}
                                            </p>
                                          </CommandItem>
                                        ))}
                                      </CommandGroup>
                                    </CommandList>
                                  </Command>
                                </PopoverContent>
                              </Popover>
                            </div>
                          );
                        })}
                    </div>
                  </ScrollArea>
                </>
              ) : (
                <div className="flex items-center justify-center p-4">
                  <Badge className="uppercase px-4 py-2">
                    No User {memberEmail && " with "} {memberEmail}
                  </Badge>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-start gap-2">
            <Separator />
            <Button
              disabled={isPublishing}
              onClick={() => {
                toast.promise(handler, {
                  loading: "Loading...",
                  success: (users) => {
                    return `The ${users.length} ${
                      users.length > 1 ? "users have" : "user has"
                    } been added`;
                  },
                  error: (errorState) =>
                    `Error: ${
                      errorState instanceof Error && errorState.message
                    }`,
                });
              }}
            >
              {isPublishing && (
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
              )}
              Add Member{membersToAdd.length > 1 ? "s" : ""}
            </Button>
          </CardFooter>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
