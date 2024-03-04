import { notImplemented } from "@/actions/notImplemented";
import { RequestError, RequestSuccess } from "@/middlewares/type";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  // try {
  //   const prisma = new PrismaClient();

  //   const { workspace, secretValue } = await request.json();

  //   const secret = await prisma.secret.findFirst({
  //     where: {
  //       orgId: workspace,
  //     },
  //   });

  //   const result = await compare(secretValue, secret.secret);

  //   if (!result) {
  //     throw new Error(
  //       "Sorry the given secret is incorrect. Please try again or generate new secret."
  //     );
  //   }

  //   prisma.$disconnect();

  //   return NextResponse.json(
  //     {
  //       status: "success",
  //       result: true,
  //     } as RequestSuccess<Boolean>,
  //     { status: 200 }
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
