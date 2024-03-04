"use client";

import { RedisActivityForWorkspace } from "@/app/api/members/route";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { Button } from "@ui/components/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@ui/components/collapsible";
import { Avatar, AvatarFallback, AvatarImage } from "@ui/components/ui/avatar";
import { Badge } from "@ui/components/ui/badge";
import { Separator } from "@ui/components/ui/separator";
import { spawn } from "child_process";
import React from "react";

const ActvitiyList = ({ result }: { result: RedisActivityForWorkspace[] }) => {
  return (
    <div className="flex flex-col gap-y-4">
      {result.map((activity, index) => (
        <CollapsibleComponent key={index} activity={activity} />
      ))}
    </div>
  );
};

const CollapsibleComponent = ({
  activity,
}: {
  activity: RedisActivityForWorkspace;
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return activity.action === "added" || activity.action === "deleted" ? (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-full space-y-2"
    >
      <div className="flex items-center justify-between space-x-4">
        <div>
          <h4 className="text-sm font-semibold">{activity.email}</h4>
          <Badge className="text-xs mt-1 font-regular py-1">
            {new Date(activity.timestamp).toLocaleString()}
          </Badge>
          <p className="text-sm mt-2">
            {activity.action === "added" ? "Added" : "Deleted"}{" "}
            {activity.members.length} new{" "}
            {activity.members.length > 1 ? "users" : "user"}
          </p>
        </div>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm">
            <CaretSortIcon className="h-4 w-4" />
            <span className="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
      </div>
      <div className="flex items-center space-x-4 rounded-md border px-4 py-2 font-mono overflow-scroll text-sm shadow-sm">
        <Avatar>
          <AvatarImage src={activity.members[0].avatar || ""} />
          <AvatarFallback>
            {activity.members[0].fullname
              .split(" ")
              .map((el) => el[0].toUpperCase())}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-medium leading-none">
            {activity.members[0].fullname}
          </p>
          <p className="text-xs text-muted-foreground">
            {activity.members[0].email}
          </p>
        </div>
      </div>
      <CollapsibleContent className="space-y-2">
        {activity.members.slice(1).map((member) => (
          <div
            key={member.id}
            className="flex items-center space-x-4 rounded-md border px-4 py-2 font-mono text-sm shadow-sm overflow-hidden"
          >
            <Avatar>
              <AvatarImage src={member.avatar || ""} />
              <AvatarFallback>
                {member.fullname.split(" ").map((el) => el[0].toUpperCase())}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium leading-none">
                {member.fullname}
              </p>
              <p className="text-xs text-muted-foreground">{member.email}</p>
            </div>
          </div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  ) : (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between space-x-4">
        <div>
          <h4 className="text-sm font-semibold">{activity.email}</h4>
          <Badge className="text-xs mt-1 font-regular py-1">
            {new Date(activity.timestamp).toLocaleString()}
          </Badge>
          <p className="text-sm mt-2 font-semibold">
            {activity.action === "added file" &&
              `Added new file: ${activity.file.name}`}
          </p>
        </div>
      </div>
      <Separator />
    </div>
  );
};

export default ActvitiyList;
