import { PrismaClient } from "database";

export const POST = async (request: Request) => {
  const prisma = new PrismaClient();
  const { workspace } = (await request.json()) as { workspace: string };

  try {
    const secret = await prisma.secret.findFirst({
      where: {
        orgId: workspace,
      },
    });

    const deletedEnvs = prisma.environmentVariables.deleteMany({
      where: {
        secretId: secret.id,
      },
    });

    const secretDeleted = prisma.secret.delete({
      where: {
        id: secret.id,
      },
    });

    const transaction = await prisma.$transaction([deletedEnvs, secretDeleted]);
    return Response.json(secret, { status: 200 });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return Response.json(error, {
      status: 400,
      statusText: (error as Error).message,
    });
  }
};
