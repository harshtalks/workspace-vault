import {
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} from "@simplewebauthn/server";
import {
  CredentialDeviceType,
  PublicKeyCredentialDescriptorFuture,
  PublicKeyCredentialRequestOptionsJSON,
} from "@simplewebauthn/server/script/deps";
import { Authenticator, GenerateOptions } from "@/utils/types";
import { NextRequest, NextResponse } from "next/server";
import db, { authenticators, eq } from "database";
import getAuth from "@/async/getAuth";
import { withError } from "@/async/with-error";
import { toUintFromStr } from "@/async/web-auth";

export const GET = withError(async (request: NextRequest) => {
  // get user from the clerk
  const user = await getAuth();

  // get all the authenticators instances
  const authResults = await db
    .select()
    .from(authenticators)
    .where(eq(authenticators.userId, user.id));

  const userAuthenticators = authResults.map(
    (auth) =>
      ({
        counter: BigInt(auth.counter!),
        credentialBackedUp: auth.credentialBackedup,
        credentialDeviceType: auth.credentialDeviceType as CredentialDeviceType,
        credentialID: toUintFromStr(auth.credentialId),
        credentialPublicKey: toUintFromStr(auth.credentialPublicKey),
        transports: auth.transports as unknown as AuthenticatorTransport[],
      } as Authenticator)
  );

  const options = await generateAuthenticationOptions({
    allowCredentials: userAuthenticators.map(
      (authenticator) =>
        ({
          id: authenticator.credentialID,
          type: "public-key",
          // Optional
          transports: authenticator.transports,
          userVerification: "preferred",
        } as PublicKeyCredentialDescriptorFuture)
    ),
  });

  const userCurrentChallenge = {
    challenge: options.challenge,
    userId: user.id,
  };

  const resp = NextResponse.json(
    {
      status: "success",
      challenge: userCurrentChallenge,
      options: options,
    } as GenerateOptions<PublicKeyCredentialRequestOptionsJSON>,
    { status: 200 }
  );

  return resp;
});

export const revalidate = 0;
