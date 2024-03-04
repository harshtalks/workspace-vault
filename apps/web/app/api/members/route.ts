import { MembersToAdd } from "@/app/workspaces/[workspace]/(dashboard)/overview/components/add-members";
import getAuth from "@/async/getAuth";
import { RequestError, RequestSuccess } from "@/middlewares/type";
import { redisClient } from "@/store/redis";
import db, {
  environmentFiles,
  eq,
  inArray,
  members,
  permissionsEnum,
  roleEnum,
  users,
} from "database";
import { NextResponse } from "next/server";

const permissionMapper = (
  role: (typeof roleEnum.enumValues)[number]
): (typeof permissionsEnum.enumValues)[number][] => {
  if (role === "Admin") {
    return ["AddMembers", "Read", "Write"];
  } else if (role === "Dev") {
    return ["Read", "Write"];
  } else return ["Read"];
};

export type RedisActivityForWorkspace =
  | {
      username: string;
      email: string;
      action: "added" | "deleted";
      members: MembersActivityData[];
      timestamp: number;
    }
  | {
      username: string;
      email: string;
      action: "added file" | "deleted file";
      timestamp: number;
      file: typeof environmentFiles.$inferSelect;
    };

export type MembersActivityData = {
  id: string;
  fullname: string;
  avatar: string | null;
  email: string;
};

export const POST = async (request: Request) => {
  try {
    const body: {
      data: MembersToAdd[];
      workspace: string;
    } = await request.json();

    const user = await getAuth();

    const userFromDB = await db.query.users.findFirst({
      where: eq(users.id, user.id),
      with: {
        members: {
          where: eq(members.workspaceId, body.workspace),
        },
      },
    });

    if (!userFromDB) {
      throw new Error("user not found");
    }

    if (!userFromDB.members[0].permissions.includes("AddMembers")) {
      throw new Error(
        "you are not authorized to do this.. don't add your friends or whatever.."
      );
    }

    const transaction = await db.transaction(async (tx) => {
      const returningMembers = await tx
        .insert(members)
        .values([
          ...body.data.map(
            (el) =>
              ({
                ownerId: el.id,
                workspaceId: body.workspace,
                role: el.role,
                permissions: permissionMapper(el.role),
              } as typeof members.$inferInsert)
          ),
        ])
        .returning();

      const respondingMembers = await tx.query.members.findMany({
        where: inArray(members.id, [...returningMembers.map((el) => el.id)]),
        with: {
          user: true,
        },
      });

      return respondingMembers;
    });

    // doing redis work.

    const membersActivityData = transaction.map((eachUser) => ({
      id: eachUser.id,
      fullname: eachUser.user.firstName + " " + eachUser.user.lastName,
      avatar: eachUser.user.avatar,
      email: eachUser.user.email,
    }));

    const timestamp = Date.now();

    const workspaceActivityData: RedisActivityForWorkspace = {
      username: user.id,
      email: user.email,
      action: "added",
      members: membersActivityData,
      timestamp,
    };

    await redisClient.zadd(`recentActivities:${body.workspace}`, {
      score: timestamp,
      member: JSON.stringify(workspaceActivityData),
    });

    // console.log("result", resultFinal);

    return NextResponse.json(
      {
        status: "success",
        result: transaction,
      } as RequestSuccess<typeof transaction>,
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message, status: "error" } as RequestError,
      {
        status: 400,
      }
    );
  }
};
