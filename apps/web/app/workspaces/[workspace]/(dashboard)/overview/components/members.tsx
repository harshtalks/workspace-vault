import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@ui/components/ui/avatar";
import { PrismaClient } from "database";
import { Badge } from "@ui/components/badge";
import { ScrollArea } from "@ui/components/ui/scroll-area";
import { cn } from "@ui/lib/utils";

const fetchMemberForTheOrg = async (workspace: string) => {
  const prismaClient = new PrismaClient();
  try {
    const members = await prismaClient.orgMember.findMany({
      where: {
        orgId: workspace,
      },
      include: {
        user: true,
      },
    });

    return {
      status: "success",
      result: members,
    };
  } catch (error) {
    return { status: "error", error: error instanceof Error && error.message };
  } finally {
    prismaClient.$disconnect();
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
