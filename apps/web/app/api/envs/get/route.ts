import { RequestError, RequestSuccess } from "@/middlewares/type";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  // try {
  //   const prisma = prismaClient;

  //   const body = await request.json();

  //   const envs = await prisma.environmentVariables.findMany({
  //     where: body.workspace,
  //   });

  //   return NextResponse.json(
  //     {
  //       result: envs,
  //       status: "success",
  //     } as RequestSuccess<EnvironmentVariables[]>,
  //     {
  //       status: 400,
  //     }
  //   );
  // } catch (error) {
  //   return NextResponse.json(
  //     { error: (error as Error).message, status: "error" } as RequestError,
  //     {
  //       status: 400,
  //     }
  //   );
  // }

  return NextResponse.json(
    {},
    {
      statusText: "Not implemented",
      status: 400,
    }
  );
};
