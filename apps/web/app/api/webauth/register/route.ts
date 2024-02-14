import { NextRequest, NextResponse } from "next/server";
import type {
  Authenticator,
  GenerateOptions,
  CredentialDeviceType,
} from "../../../../utils/types";
import { generateRegistrationOptions } from "@simplewebauthn/server";
import { getAuth } from "@clerk/nextjs/server";
import { PublicKeyCredentialCreationOptionsJSON } from "@simplewebauthn/server/script/deps";
import db, { authenticators, eq, users } from "database";

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
  try {
    const authUser = await db
      .select()
      .from(users)
      .where(eq(users.id, user.userId));

    const authResults = await db
      .select()
      .from(authenticators)
      .where(eq(authenticators.userId, user.userId));

    console.log(authResults);

    const userAuthenticators = authResults.map(
      (auth) =>
        ({
          counter: BigInt(auth.counter),
          credentialBackedUp: auth.credentialBackedup,
          credentialDeviceType:
            auth.credentialDeviceType as CredentialDeviceType,
          credentialID: auth.credentialId,
          credentialPublicKey: auth.credentialPublicKey,
          transports: auth.transports as unknown as AuthenticatorTransport[],
        } as Authenticator)
    );

    const options = await generateRegistrationOptions({
      rpName,
      rpID,
      userID: user.userId,
      userName: authUser[0].email,
      attestationType: "none",
      excludeCredentials: userAuthenticators.map((authenticator) => ({
        id: authenticator.credentialID,
        type: "public-key",
        // Optional
        transports: authenticator.transports,
      })),
    });

    const userCurrentChallenge = {
      challenge: options.challenge,
      userId: user.userId,
    };

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
