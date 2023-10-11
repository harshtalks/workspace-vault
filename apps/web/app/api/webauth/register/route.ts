import { NextRequest, NextResponse } from "next/server";
import type {
  Authenticator,
  GenerateOptions,
  CredentialDeviceType,
} from "../../../../utils/types";
import { generateRegistrationOptions } from "@simplewebauthn/server";
import { getAuth } from "@clerk/nextjs/server";
import { PrismaClient } from "database";
import { PublicKeyCredentialCreationOptionsJSON } from "@simplewebauthn/server/script/deps";

export const GET = async (request: NextRequest) => {
  if (!process.env.NEXT_PUBLIC_RP_NAME || !process.env.NEXT_PUBLIC_RP_ID) {
    throw new Error("Internal Server Error");
  }
  // Human-readable title for your website
  const rpName = process.env.NEXT_PUBLIC_RP_NAME;
  // A unique identifier for your website
  const rpID = process.env.NEXT_PUBLIC_RP_ID;
  // The URL at which registrations and authentications should occur

  // get user

  const user = getAuth(request);

  if (!user.userId) {
    throw new Error("You are not authorized.");
  }

  // authenticators
  const prismaClient = new PrismaClient();
  try {
    const authUser = await prismaClient.user.findFirstOrThrow({
      where: {
        id: user.userId,
      },
    });

    const authResults = await prismaClient.authenticators.findMany({
      where: {
        userId: user.userId,
      },
    });

    console.log("Auth results found..");

    const userAuthenticators = authResults.map(
      (auth) =>
        ({
          counter: auth.counter,
          credentialBackedUp: auth.credentialBackedUp,
          credentialDeviceType:
            auth.credentialDeviceType as CredentialDeviceType,
          credentialID: auth.credentialID,
          credentialPublicKey: auth.credentialPublicKey,
          transports: auth.transports as unknown as AuthenticatorTransport[],
        } as Authenticator)
    );

    console.log(userAuthenticators);

    const options = await generateRegistrationOptions({
      rpName,
      rpID,
      userID: user.userId,
      userName: authUser.email,
      attestationType: "none",
      excludeCredentials: userAuthenticators.map((authenticator) => ({
        id: authenticator.credentialID,
        type: "public-key",
        // Optional
        transports: authenticator.transports,
      })),
    });

    console.log("options generated..", options);

    const userCurrentChallenge = {
      challenge: options.challenge,
      userId: user.userId,
    };

    console.log("response being sent over client..");

    prismaClient.$disconnect();

    return new NextResponse(
      JSON.stringify({
        status: "success",
        challenge: userCurrentChallenge,
        options: options,
      } as GenerateOptions<PublicKeyCredentialCreationOptionsJSON>),
      {
        status: 201,
      }
    );
  } catch (error) {
    return new NextResponse(
      JSON.stringify({
        status: "error",
        error: error instanceof Error ? error.message : "An error occured",
      } as GenerateOptions<PublicKeyCredentialCreationOptionsJSON>),
      {
        status: 404,
      }
    );
  }
};
