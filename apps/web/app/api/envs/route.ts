import { AddNewEnvProps } from "@/components/Form";
import {
  WorkspaceError,
  WorkspaceResponse,
  WorkspaceSuccess,
} from "@/middlewares/type";
import { EnvironmentVariables, prismaClient } from "database";
import { NextRequest } from "next/server";

export type EnvAPIRequestBody = {
  envs: AddNewEnvProps;
  workspace: string;
  envId?: number;
};

export const POST = async (request: NextRequest) => {
  try {
    const prisma = prismaClient;

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

    return Response.json(
      {
        result: envVault,
        status: "success",
      } as WorkspaceSuccess<EnvironmentVariables>,
      {
        status: 201,
      }
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
