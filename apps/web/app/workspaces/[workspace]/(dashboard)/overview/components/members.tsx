import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@ui/components/ui/avatar";
import db, { eq, members } from "database";
import { Badge } from "@ui/components/badge";
import { ScrollArea } from "@ui/components/ui/scroll-area";
import { cn } from "@ui/lib/utils";
import { currentUser } from "@clerk/nextjs";

const fetchMemberForTheOrg = async (workspace: string) => {
  try {
    const { id } = await currentUser();

    const result = await db.query.members.findMany({
      where: eq(members.workspaceId, workspace),
      with: {
        user: true,
      },
    });

    return {
      status: "success",
      result: result,
    };
  } catch (error) {
    return { status: "error", error: error instanceof Error && error.message };
  }
};

export const capitalize = (name: string) =>
  name[0].toUpperCase() + name.slice(1);

const Members = async ({ workspace }: { workspace: string }) => {
  const members = await fetchMemberForTheOrg(workspace);
  return members.status === "success" ? (
    <ScrollArea
      className={cn(
        "w-full",
        members.result.length >= 5 && "overflow-hidden h-[400px]"
      )}
    >
      <div className="space-y-4 pr-2.5">
        {members.result.map((member) => (
          <div key={member.id} className="flex items-center">
            <Avatar className="h-9 w-9">
              <AvatarImage src={member.user.avatar} alt="Avatar" />
              <AvatarFallback>
                {member.user.firstName[0].toUpperCase() +
                  member.user.lastName[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="ml-4 flex flex-col w-full">
              <div className="flex justify-between items-center w-full">
                <p className="text-sm font-medium leading-none">
                  {capitalize(member.user.firstName) +
                    " " +
                    capitalize(member.user.lastName)}
                </p>
                <div className="ml-auto">
                  <Badge variant="outline">{capitalize(member.role)}</Badge>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                {member.user.email}
              </p>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  ) : (
    <div>
      <p>{members.error}</p>
    </div>
  );
};

export default Members;
