import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import type {
  ClientGenerateOptions,
  VerifyOptions,
} from "../../../../utils/types";
import { verifyRegistrationResponse } from "@simplewebauthn/server";
import { RegistrationResponseJSON } from "@simplewebauthn/server/script/deps";
import db, { authenticators } from "database";

export const POST = async (request: NextRequest) => {
  if (
    !process.env.NEXT_PUBLIC_RP_NAME ||
    !process.env.NEXT_PUBLIC_RP_ID ||
    !process.env.NEXT_PUBLIC_RP_ORIGIN
  ) {
    throw new Error("Internal Server Error");
  }
  // Human-readable title for your website
  const rpName = process.env.NEXT_PUBLIC_RP_NAME;
  // A unique identifier for your website
  const rpID = process.env.NEXT_PUBLIC_RP_ID;
  // The URL at which registrations and authentications should occur
  const origin = process.env.NEXT_PUBLIC_RP_ORIGIN;

  const user = getAuth(request);

  try {
    const body: ClientGenerateOptions<RegistrationResponseJSON> =
      await request.json();

    console.log("verification started...");

    const verification = await verifyRegistrationResponse({
      response: body.response,
      expectedChallenge: body.challenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
    });

    console.log("verification done...");

    const { verified } = verification;

    // POST Registration

    const { registrationInfo } = verification;
    const {
      credentialPublicKey,
      credentialID,
      counter,
      credentialBackedUp,
      credentialDeviceType,
    } = registrationInfo;

    console.log("registrationInfo", registrationInfo);

    const savingNewAuth = await db
      .insert(authenticators)
      .values({
        userId: user.userId,
        counter: counter,
        credentialBackedup: credentialBackedUp,
        credentialDeviceType: credentialDeviceType,
        credentialId: credentialID as Buffer,
        credentialPublicKey: credentialPublicKey as Buffer,
        transports: [],
      })
      .returning();

    console.log("saved in the database: ", savingNewAuth);

    return new NextResponse(
      JSON.stringify({
        status: "success",
        verified,
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
