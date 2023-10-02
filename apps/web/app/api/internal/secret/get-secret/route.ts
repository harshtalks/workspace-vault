import { PrismaClient } from "database";

export const POST = async (request: Request) => {
  const prisma = new PrismaClient();
  const { userId } = (await request.json()) as { userId: string };

  try {
    const secret = await prisma.secret.findFirst({
      where: {
        userId,
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
