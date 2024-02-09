import { secretDB } from "@/utils/local-store";
import { currentUser } from "@clerk/nextjs";
import { Badge } from "@ui/components/ui/badge";
import { Button } from "@ui/components/ui/button";
import db, { eq, members, workspaces } from "database";
import Link from "next/link";
import { redirect } from "next/navigation";
import React, { use } from "react";

const onlyMembersAllowed = async (workspaceId: string) => {
  const user = await currentUser();

  try {
    const member = await db.query.workspaces.findFirst({
      where: eq(workspaces.id, workspaceId),
      with: {
        members: {
          where: eq(members.ownerId, user.id),
        },
      },
    });

    if (member.id) {
      return true;
    } else return false;
  } catch (error) {
    return false;
  }
};

const Layout = async ({
  params,
  children,
}: {
  params: { workspace: string };
  children: React.ReactNode;
}) => {
  const response = await onlyMembersAllowed(params.workspace);

  return (
    <div>
      {response ? (
        <div className="pb-12">{children}</div>
      ) : (
        <div className="pt-24 pb-12">
          <div className="flex flex-col items-center justify-center gap-2">
            <h2 className="text-4xl">Invalid Workspace Id :(</h2>
            <div className="h-96 w-96">
              <iframe
                src="https://giphy.com/embed/aPl9Xqe6DtV3q"
                width="100%"
                height="100%"
                className="giphy-embed"
                allowFullScreen
              ></iframe>
            </div>
            <p>
              We could not find any workspace with id{" "}
              <Badge variant="outline" className="py-1">
                {params.workspace}
              </Badge>{" "}
              attached with your account.
            </p>
            <Link href="/get-started/workspaces">
              <Button>All your workspaces</Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;
