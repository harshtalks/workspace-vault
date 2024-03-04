import { notImplemented } from "@/actions/notImplemented";
import { RequestError, RequestSuccess } from "@/middlewares/type";
import { redisClient } from "@/store/redis";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  // try {
  //   const body: AccessProps = await request.json();

  //   const prismaClient = new PrismaClient();

  //   const userWhoAccessed = await prismaClient.user.findUniqueOrThrow({
  //     where: {
  //       id: body.userId,
  //       orgMembers: {
  //         some: {
  //           orgId: body.workspaceId,
  //         },
  //       },
  //     },
  //     include: {
  //       orgMembers: true,
  //     },
  //   });

  //   // redis work
  //   const timestamp = Date.now();

  //   const keyForRedisValue = `recentLogs:${body.envFileId}`;

  //   const dataToStore: RedisFileAccess = {
  //     user: {
  //       id: userWhoAccessed.id,
  //       avatar: userWhoAccessed.avatar,
  //       firstName: userWhoAccessed.firstName,
  //       lastName: userWhoAccessed.lastName,
  //       email: userWhoAccessed.email,
  //       role: userWhoAccessed.orgMembers[0].role,
  //     },
  //     access: body.accessType,
  //     timestamp: timestamp,
  //   };

  //   await redisClient.zadd(keyForRedisValue, {
  //     score: timestamp,
  //     member: JSON.stringify(dataToStore),
  //   });

  //   prismaClient.$disconnect();

  //   return NextResponse.json(
  //     {
  //       status: "success",
  //       result: true,
  //     } as RequestSuccess<boolean>,
  //     { status: 201 }
  //   );
  // } catch (error) {
  //   return NextResponse.json(
  //     { error: (error as Error).message, status: "error" } as RequestError,
  //     {
  //       status: 400,
  //     }
  //   );
  // }

  notImplemented();
};
