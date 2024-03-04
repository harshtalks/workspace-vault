import { NextRequest, NextResponse } from "next/server";
import type {
  ClientGenerateOptions,
  VerifyOptions,
} from "../../../../utils/types";
import { verifyRegistrationResponse } from "@simplewebauthn/server";
import { RegistrationResponseJSON } from "@simplewebauthn/server/script/deps";
import db, { authenticators } from "database";
import getAuth from "@/async/getAuth";
import { withError } from "@/async/with-error";
import { equals } from "uint8arrays/equals";
import { toStringFromUint } from "@/async/web-auth";

// Function to convert Uint8Array to string

export const POST = withError(async (request: NextRequest) => {
  if (!process.env.RP_NAME || !process.env.RP_ID || !process.env.RP_ORIGIN) {
    throw new Error("Internal Server Error");
  }
  // Human-readable title for your website
  const rpName = process.env.RP_NAME;
  // A unique identifier for your website
  const rpID = process.env.RP_ID;
  // The URL at which registrations and authentications should occur
  const origin = process.env.RP_ORIGIN;

  const user = await getAuth();

  const body: ClientGenerateOptions<RegistrationResponseJSON> =
    await request.json();

  const verification = await verifyRegistrationResponse({
    response: body.response,
    expectedChallenge: body.challenge,
    expectedOrigin: origin,
    expectedRPID: rpID,
  });

  const { verified } = verification;

  // POST Registration

  const { registrationInfo } = verification;

  if (!registrationInfo) {
    throw new Error("Registration Info not found");
  }

  const {
    credentialPublicKey,
    credentialID,
    counter,
    credentialBackedUp,
    credentialDeviceType,
  } = registrationInfo;

  const savingNewAuth = await db
    .insert(authenticators)
    .values({
      userId: user.id,
      counter: counter,
      credentialBackedup: credentialBackedUp,
      credentialDeviceType: credentialDeviceType,
      credentialId: toStringFromUint(credentialID),
      credentialPublicKey: toStringFromUint(credentialPublicKey),
      transports: body.transports,
    })
    .returning();

  const whatISendToDB = Buffer.from(credentialID).toString("base64");

  return new NextResponse(
    JSON.stringify({
      status: "success",
      verified,
    } as VerifyOptions),
    { status: 201, statusText: "Successfully verified" }
  );
});
