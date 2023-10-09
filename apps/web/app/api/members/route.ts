import { MembersToAdd } from "@/app/workspaces/[workspace]/(dashboard)/overview/components/add-members";
import { WorkspaceError, WorkspaceSuccess } from "@/middlewares/type";
import { redisClient } from "@/store/redis";
import { currentUser } from "@clerk/nextjs";
import {
  OrgMember,
  Permission,
  Prisma,
  PrismaClient,
  Role,
  User,
} from "database";
import { nanoid } from "nanoid";

const permissionMapper = (role: Role): Permission[] => {
  if (role === "admin") {
    return ["add_user", "read", "write"];
  } else if (role === "dev") {
    return ["read", "write"];
  } else return ["read"];
};

export interface RedisActivityForWorkspace {
  username: string;
  email: string;
  action: "added" | "deleted";
  members: MembersActivityData[];
}

export interface MembersActivityData {
  id: string;
  fullname: string;
  avatar: string;
  email: string;
}

export const POST = async (request: Request) => {
  try {
    const body: {
      data: MembersToAdd[];
      workspace: string;
    } = await request.json();

    const user = await currentUser();

    const prisma = new PrismaClient();

    const userFromDB = await prisma.user.findUniqueOrThrow({
      where: {
        id: user.id,
      },
      include: {
        orgMembers: {
          where: {
            orgId: body.workspace,
          },
        },
      },
    });

    if (!userFromDB.orgMembers[0].permission.includes("add_user")) {
      throw new Error(
        "you are not authorized to do this.. don't add your friends or whatever.."
      );
    }

    const users: Prisma.Prisma__OrgMemberClient<OrgMember & { user: User }>[] =
      [];

    body.data.forEach((eachUser) => {
      const member = prisma.orgMember.create({
        data: {
          userId: eachUser.id,
          role: eachUser.role,
          permission: permissionMapper(eachUser.role),
          orgId: body.workspace,
          id: nanoid(),
        },
        include: { user: true },
      });

      users.push(member);
    });

    const transaction = await prisma.$transaction(users);

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
      email: user.emailAddresses[0].emailAddress,
      action: "added",
      members: membersActivityData,
    };

    await redisClient.zadd(`recentActivities:${body.workspace}`, {
      score: timestamp,
      member: JSON.stringify(workspaceActivityData),
    });

    // console.log("result", resultFinal);

    return Response.json(
      {
        status: "success",
        result: transaction,
      } as WorkspaceSuccess<OrgMember[]>,
      { status: 201 }
    );
  } catch (error) {
    return Response.json(
      { error: (error as Error).message, status: "error" } as WorkspaceError,
      {
        status: 400,
      }
    );
  }
};
