import { WorkspaceError, WorkspaceSuccess } from "@/middlewares/type";
import { redisClient } from "@/store/redis";
import { PrismaClient, Role, User } from "database";

export type AccessType = "read" | "write";
export type AccessProps = {
  userId: string;
  workspaceId: string;
  accessType: AccessType;
  envFileId: number;
};

export type RedisFileAccess = {
  user: Omit<User, "created_at" | "updated_at"> & { role: Role };
  access: AccessType;
  timestamp: number;
};

export const POST = async (request: Request) => {
  try {
    const body: AccessProps = await request.json();

    const prismaClient = new PrismaClient();

    const userWhoAccessed = await prismaClient.user.findUniqueOrThrow({
      where: {
        id: body.userId,
        orgMembers: {
          some: {
            orgId: body.workspaceId,
          },
        },
      },
      include: {
        orgMembers: true,
      },
    });

    // redis work
    const timestamp = Date.now();

    const keyForRedisValue = `recentLogs:${body.envFileId}`;

    const dataToStore: RedisFileAccess = {
      user: {
        id: userWhoAccessed.id,
        avatar: userWhoAccessed.avatar,
        firstName: userWhoAccessed.firstName,
        lastName: userWhoAccessed.lastName,
        email: userWhoAccessed.email,
        role: userWhoAccessed.orgMembers[0].role,
      },
      access: body.accessType,
      timestamp: timestamp,
    };

    await redisClient.zadd(keyForRedisValue, {
      score: timestamp,
      member: JSON.stringify(dataToStore),
    });

    return Response.json(
      {
        status: "success",
        result: true,
      } as WorkspaceSuccess<boolean>,
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
