import {
  Authenticator,
  ClientGenerateOptions,
  VerifyOptions,
} from "@/utils/types";
import { getAuth } from "@clerk/nextjs/server";
import { verifyAuthenticationResponse } from "@simplewebauthn/server";
import { AuthenticationResponseJSON } from "@simplewebauthn/server/script/deps";
import { PrismaClient } from "database";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  // Human-readable title for your website
  const rpName = "WorkspaceVault";
  // A unique identifier for your website
  const rpID = "localhost";
  // The URL at which registrations and authentications should occur
  const origin = `http://${rpID}:3000`;

  try {
    const user = getAuth(request);

    if (!user.userId) {
      throw new Error("You are not authorized.");
    }

    const prismaClient = new PrismaClient();

    // getting the body
    const body: ClientGenerateOptions<AuthenticationResponseJSON> =
      await request.json();

    const authenticator = await prismaClient.authenticators.findFirst({
      where: {
        credentialID: Buffer.from(body.response.id, "base64"),
      },
    });

    if (!authenticator) {
      throw new Error(
        `Could not find authenticator ${body.response.id} for user ${user.userId}`
      );
    }

    console.log("verification started...");

    // verification
    const verification = await verifyAuthenticationResponse({
      response: body.response,
      expectedChallenge: body.challenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
      authenticator: {
        counter: Number(authenticator.counter),
        credentialID: authenticator.credentialID,
        credentialPublicKey: authenticator.credentialPublicKey,
        transports: authenticator.transports as AuthenticatorTransport[],
      },
    });

    const { verified } = verification;

    const { authenticationInfo } = verification;
    const { newCounter } = authenticationInfo;

    // updating the count of the authenticator

    const updatedAuthenticator = await prismaClient.authenticators.update({
      where: {
        id: authenticator.id,
      },
      data: {
        counter: newCounter,
      },
    });

    return new NextResponse(
      JSON.stringify({
        status: "success",
        verified,
        key: authenticator.credentialPublicKey.toString(),
      } as VerifyOptions),
      { status: 201, statusText: "Successfully verified" }
    );
  } catch (error) {
    return new NextResponse(
      JSON.stringify({
        status: "error",
        error: error instanceof Error ? error.message : "An Error Occured.",
      } as VerifyOptions),
      {
        status: 404,
      }
    );
  }
};
