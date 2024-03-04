import getAuth from "@/async/getAuth";
import { toUintFromStr } from "@/async/web-auth";
import { withError } from "@/async/with-error";
import {
  Authenticator,
  ClientGenerateOptions,
  VerifyOptions,
} from "@/utils/types";
import { verifyAuthenticationResponse } from "@simplewebauthn/server";
import { AuthenticationResponseJSON } from "@simplewebauthn/server/script/deps";
import db, { authenticators, eq } from "database";
import { NextRequest, NextResponse } from "next/server";

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

  if (!user.id) {
    throw new Error("You are not authorized.");
  }

  // getting the body
  const body: ClientGenerateOptions<AuthenticationResponseJSON> =
    await request.json();

  const authenticator = await db
    .select()
    .from(authenticators)
    .where(eq(authenticators.credentialId, body.response.id))
    .then((res) => res[0]);

  const resp = await db.select().from(authenticators);

  if (!authenticator) {
    throw new Error(
      `Could not find authenticator ${body.response.id} for user ${user.id}`
    );
  }

  // verification
  const verification = await verifyAuthenticationResponse({
    response: body.response,
    expectedChallenge: body.challenge,
    expectedOrigin: origin,
    expectedRPID: rpID,
    authenticator: {
      counter: Number(authenticator.counter),
      credentialID: toUintFromStr(authenticator.credentialId),
      credentialPublicKey: toUintFromStr(authenticator.credentialPublicKey),
      transports: authenticator.transports as AuthenticatorTransport[],
    },
  });

  const { verified } = verification;

  const { authenticationInfo } = verification;
  const { newCounter } = authenticationInfo;

  // updating the count of the authenticator

  await db
    .update(authenticators)
    .set({ counter: newCounter })
    .where(eq(authenticators.id, authenticator.id));

  return new NextResponse(
    JSON.stringify({
      status: "success",
      verified,
      key: authenticator.credentialPublicKey.toString(),
    } as VerifyOptions),
    { status: 201, statusText: "Successfully verified" }
  );
});
