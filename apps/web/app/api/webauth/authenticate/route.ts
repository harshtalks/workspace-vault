import {
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} from "@simplewebauthn/server";
import { getAuth } from "@clerk/nextjs/server";
import { PrismaClient } from "database";
import {
  CredentialDeviceType,
  PublicKeyCredentialRequestOptionsJSON,
} from "@simplewebauthn/server/script/deps";
import { Authenticator, GenerateOptions } from "@/utils/types";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  // get user from the clerk

  try {
    const user = getAuth(request);

    if (!user.userId) {
      throw new Error("You are not authorized.");
    }

    // database config
    // const prismaClient = new PrismaClient();

    // // get all the authenticators instances
    // const authResults = await prismaClient.authenticators.findMany({
    //   where: {
    //     userId: user.userId,
    //   },
    // });

    // console.log("Auth results found..");

    // const userAuthenticators = authResults.map(
    //   (auth) =>
    //     ({
    //       counter: auth.counter,
    //       credentialBackedUp: auth.credentialBackedUp,
    //       credentialDeviceType:
    //         auth.credentialDeviceType as CredentialDeviceType,
    //       credentialID: auth.credentialID,
    //       credentialPublicKey: auth.credentialPublicKey,
    //       transports: auth.transports as unknown as AuthenticatorTransport[],
    //     } as Authenticator)
    // );

    // const options = await generateAuthenticationOptions({
    //   allowCredentials: userAuthenticators.map((authenticator) => ({
    //     id: authenticator.credentialID,
    //     type: "public-key",
    //     // Optional
    //     transports: authenticator.transports,
    //     userVerification: "preferred",
    //   })),
    // });

    // console.log("options generated...");

    // const userCurrentChallenge = {
    //   challenge: options.challenge,
    //   userId: user.userId,
    // };

    // prismaClient.$disconnect();

    return new NextResponse(
      JSON.stringify({
        error: "error",
      } as GenerateOptions<PublicKeyCredentialRequestOptionsJSON>),
      {
        status: 200,
      }
    );
  } catch (error) {
    return new NextResponse(
      JSON.stringify({
        status: "error",
        error: error instanceof Error ? error.message : "An error occured",
      } as GenerateOptions<PublicKeyCredentialRequestOptionsJSON>),
      {
        status: 404,
      }
    );
  }
};

export const revalidate = 0;
