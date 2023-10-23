import { AddNewEnvProps } from "@/components/Form";
import {
  WorkspaceError,
  WorkspaceResponse,
  WorkspaceSuccess,
} from "@/middlewares/type";
import { EnvironmentVariables, prismaClient } from "database";
import { NextResponse } from "next/server";
import { RedisActivityForWorkspace } from "../members/route";
import { currentUser } from "@clerk/nextjs/server";
import { redisClient } from "@/store/redis";

export type EnvAPIRequestBody = {
  envs: AddNewEnvProps;
  workspace: string;
  envId?: number;
};

export const POST = async (request: Request) => {
  try {
    const prisma = prismaClient;

    const user = await currentUser();

    const body = (await request.json()) as EnvAPIRequestBody;

    const secret = await prisma.secret.findFirst({
      where: {
        orgId: body.workspace,
      },
    });

    // saving the variable to the database.
    let envVault: EnvironmentVariables;
    if (body.envId) {
      // updating
      envVault = await prisma.environmentVariables.update({
        where: {
          id: body.envId,
        },
        data: {
          name: body.envs.name,
          variables: body.envs.envariables,
        },
      });
    } else {
      // saving
      envVault = await prisma.environmentVariables.create({
        data: {
          secretId: secret.id,
          name: body.envs.name,
          variables: body.envs.envariables,
        },
      });
    }

    const timestamp = Date.now();

    const workspaceActivityData: RedisActivityForWorkspace = {
      action: "added file",
      file: envVault,
      timestamp,
      username: user.id,
      email: user.emailAddresses[0].emailAddress,
    };

    await redisClient.zadd(`recentActivities:${body.workspace}`, {
      score: timestamp,
      member: JSON.stringify(workspaceActivityData),
    });

    return NextResponse.json(
      {
        result: envVault,
        status: "success",
      } as WorkspaceSuccess<EnvironmentVariables>,
      {
        status: 201,
      }
    );
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message, status: "error" } as WorkspaceError,
      {
        status: 400,
      }
    );
  }
};
