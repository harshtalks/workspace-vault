import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  // const prisma = prismaClient;
  // const { workspace } = (await request.json()) as { workspace: string };

  // try {
  //   const secret = await prisma.secret.findFirst({
  //     where: {
  //       orgId: workspace,
  //     },
  //   });

  //   const deletedEnvs = prisma.environmentVariables.deleteMany({
  //     where: {
  //       secretId: secret.id,
  //     },
  //   });

  //   const secretDeleted = prisma.secret.delete({
  //     where: {
  //       id: secret.id,
  //     },
  //   });

  //   const transaction = await prisma.$transaction([deletedEnvs, secretDeleted]);

  //   return NextResponse.json(secret, { status: 200 });
  // } catch (error) {
  //   console.error("Error fetching posts:", error);
  //   return NextResponse.json(error, {
  //     status: 400,
  //     statusText: (error as Error).message,
  //   });
  // }

  return NextResponse.json(
    {},
    {
      statusText: "Not implemented",
      status: 400,
    }
  );
};
