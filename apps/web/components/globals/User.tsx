import { getAuth } from "@/app/login/github/validate/validate.fetcher";
import { validateRequest } from "@/lib/auth/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@ui/components/ui/avatar";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@ui/components/hover-card";
import { Button } from "@ui/components/ui/button";
import { SignOut } from "./Signout";
import Deauthenticate from "./deauthenticate";

export const User = async () => {
  const { user } = await validateRequest();

  return user?.avatar ? (
    <HoverCard>
      <HoverCardTrigger className="cursor-pointer">
        <Avatar className="border border-zinc-200">
          <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
          <AvatarImage src={user.avatar} alt={user.id} />
        </Avatar>
      </HoverCardTrigger>
      <HoverCardContent>
        <div className="flex flex-col items-start gap-2">
          <p className="text-sm font-medium">{user.username}</p>
          <p className="text-xs text-zinc-600">{user.id}</p>
        </div>
        <div className="py-4">
          {/** @ts-ignore */}
          <SignOut />
        </div>
        <Deauthenticate />
      </HoverCardContent>
    </HoverCard>
  ) : null;
};
