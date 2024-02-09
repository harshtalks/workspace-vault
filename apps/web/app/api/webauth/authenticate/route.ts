import {
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} from "@simplewebauthn/server";
import { getAuth } from "@clerk/nextjs/server";
import {
  CredentialDeviceType,
  PublicKeyCredentialRequestOptionsJSON,
} from "@simplewebauthn/server/script/deps";
import { Authenticator, GenerateOptions } from "@/utils/types";
import { NextRequest, NextResponse } from "next/server";
import db, { authenticators, eq } from "database";

export const GET = async (request: NextRequest) => {
  try {
    // get user from the clerk
    const user = getAuth(request);

    if (!user.userId) {
      throw new Error("You are not authorized.");
    }

    // get all the authenticators instances
    const authResults = await db
      .select()
      .from(authenticators)
      .where(eq(authenticators.userId, user.userId));

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

    console.log("user Auths", userAuthenticators);

    const options = await generateAuthenticationOptions({
      allowCredentials: userAuthenticators.map((authenticator) => ({
        id: authenticator.credentialID,
        type: "public-key",
        // Optional
        transports: authenticator.transports,
        userVerification: "preferred",
      })),
    });

    console.log("options generated...", options);

    const userCurrentChallenge = {
      challenge: options.challenge,
      userId: user.userId,
    };

    return NextResponse.json(
      {
        status: "success",
        challenge: userCurrentChallenge,
        options: options,
      } as GenerateOptions<PublicKeyCredentialRequestOptionsJSON>,
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        error: error instanceof Error ? error.message : "An error occured",
      } as GenerateOptions<PublicKeyCredentialRequestOptionsJSON>,
      {
        status: 404,
      }
    );
  }
};

export const revalidate = 0;
