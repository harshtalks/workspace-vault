import { currentUser } from "@clerk/nextjs";
import { Button } from "@ui/components/ui/button";
import { PrismaClient } from "database";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

const onlyMembersAllowed = async (workspaceId: string) => {
  const user = await currentUser();
  const prisma = new PrismaClient();

  try {
    const member = await prisma.orgMember.findFirstOrThrow({
      where: {
        orgId: workspaceId,
        userId: user.id,
      },
    });

    return true;
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

  if (!response) {
    return redirect("/get-started/workspaces");
  }

  return (
    <div>
      {response ? (
        children
      ) : (
        <div className="pt-24">
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
              We could not find any workspace with id {params.workspace}{" "}
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
