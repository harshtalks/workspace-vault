import { PrismaClient, prismaClient } from "database";

export const POST = async (request: Request) => {
  const prisma = prismaClient;
  const { workspace } = (await request.json()) as { workspace: string };

  try {
    const secret = await prisma.secret.findFirst({
      where: {
        orgId: workspace,
      },
    });

    return Response.json(secret, { status: 200 });
  } catch (error) {
    return Response.json(error, {
      status: 400,
      statusText: (error as Error).message,
    });
  }
};
