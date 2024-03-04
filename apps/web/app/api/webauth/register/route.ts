import { NextRequest, NextResponse } from "next/server";
import type {
  Authenticator,
  GenerateOptions,
  CredentialDeviceType,
} from "../../../../utils/types";
import { generateRegistrationOptions } from "@simplewebauthn/server";
import { PublicKeyCredentialCreationOptionsJSON } from "@simplewebauthn/server/script/deps";
import db, { authenticators, eq, users } from "database";
import getAuth from "@/async/getAuth";
import { withError } from "@/async/with-error";
import { toUintFromStr } from "@/async/web-auth";

export const GET = withError(async (request: NextRequest) => {
  if (!process.env.RP_NAME || !process.env.RP_ID || !process.env.RP_ORIGIN) {
    throw new Error("Internal Server Error");
  }
  // Human-readable title for your website
  const rpName = process.env.RP_NAME;
  // A unique identifier for your website
  const rpID = process.env.RP_ID;
  // The URL at which registrations and authentications should occur
  const rpOrigin = process.env.RP_ORIGIN;

  // get user
  const user = await getAuth();

  // find the user from the database
  const authUser = await db.select().from(users).where(eq(users.id, user.id));

  // find the authenticators associated with user
  const authResults = await db
    .select()
    .from(authenticators)
    .where(eq(authenticators.userId, user.id));

  // Mapping
  const userAuthenticators = authResults.map(
    (auth) =>
      ({
        counter: BigInt(auth.counter),
        credentialBackedUp: auth.credentialBackedup,
        credentialDeviceType: auth.credentialDeviceType as CredentialDeviceType,
        credentialID: toUintFromStr(auth.credentialId),
        credentialPublicKey: toUintFromStr(auth.credentialPublicKey),
        transports: auth.transports as unknown as AuthenticatorTransport[],
      } as Authenticator)
  );

  const options = await generateRegistrationOptions({
    rpName,
    rpID,
    userID: user.id,
    userName: authUser[0].email,
    attestationType: "none",
    excludeCredentials: userAuthenticators.map((authenticator) => ({
      id: authenticator.credentialID,
      type: "public-key",
      // Optional
      transports: authenticator.transports,
    })),
    // See "Guiding use of authenticators via authenticatorSelection" below
    authenticatorSelection: {
      // Defaults
      residentKey: "preferred",
      userVerification: "preferred",
      // Optional
      authenticatorAttachment: "platform",
    },
  });

  const userCurrentChallenge = {
    challenge: options.challenge,
    userId: user.id,
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
});
