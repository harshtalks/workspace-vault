import { WebAuthSignedStates } from "@/components/stepper/webauth-signup";
import {
  ClientGenerateOptions,
  GenerateOptions,
  VerifyOptions,
} from "@/utils/types";
import {
  startAuthentication,
  startRegistration,
} from "@simplewebauthn/browser";
import {
  AuthenticationResponseJSON,
  PublicKeyCredentialCreationOptionsJSON,
  PublicKeyCredentialRequestOptionsJSON,
  RegistrationResponseJSON,
} from "@simplewebauthn/server/script/deps";
import * as React from "react";
import { toast } from "sonner";

/**
 * @name toStringFromUint
 * @description convert a Uint8Array to a string
 * @param uint8array {Uint8Array}
 * @returns
 */

export const toStringFromUint = (uint8array: Uint8Array) => {
  /**
   * @description Here we have used base64url encoding to convert the Uint8Array to a string
   * @see https://w3c.github.io/webauthn/#dictdef-authenticationresponsejson
   */
  return Buffer.from(uint8array).toString("base64url");
};

/**
 * @name toUintFromStr
 * @description convert a string to a Uint8Array
 * @param str {string}
 * @returns
 */

export const toUintFromStr = (str: string) => {
  /**
   * @description Here we have used base64url decoding to convert the string to a Uint8Array
   * @see https://w3c.github.io/webauthn/#dictdef-authenticationresponsejson
   */
  return new Uint8Array(Buffer.from(str, "base64url"));
};

/**
 * @description handle the webAuth Registration process
 */

export const webAuthnHandler = async (
  setIsSigned: React.Dispatch<React.SetStateAction<WebAuthSignedStates>>
) => {
  try {
    setIsSigned("isPending");
    // getting the registration options

    const responseFromTheServer = await fetch("/api/webauth/register");

    const registrationResponse =
      (await responseFromTheServer.json()) as GenerateOptions<PublicKeyCredentialCreationOptionsJSON>;

    if (registrationResponse.status === "error") {
      throw new Error(registrationResponse.error);
    }

    const authResponse = await startRegistration(registrationResponse.options);

    const verificationResponse = await fetch("/api/webauth/verify-register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        response: authResponse,
        challenge: registrationResponse.challenge.challenge,
        transports: authResponse.response.transports,
      } as ClientGenerateOptions<RegistrationResponseJSON>),
    });

    const unmarshalledVerification =
      (await verificationResponse.json()) as VerifyOptions;

    if (unmarshalledVerification.status === "error") {
      throw new Error(unmarshalledVerification.error);
    }

    if (
      unmarshalledVerification.status === "success" &&
      unmarshalledVerification.verified
    ) {
      setIsSigned("success");
      return true;
    }
  } catch (error) {
    setIsSigned("error");
    console.error(error);
    error instanceof Error
      ? toast.error(`${error.name}: ${error.message}`)
      : toast.error(`An error occured! Please try again.`);
  }
};

export const handleWebAuthenticate = async (
  setIsSigned: React.Dispatch<React.SetStateAction<WebAuthSignedStates>>
) => {
  try {
    // loading state
    setIsSigned("isPending");

    // fetching endpoint to get the options

    const responseFromTheServer = await fetch("/api/webauth/authenticate", {
      cache: "no-cache",
    });

    const unmarshalledResponseFromTheServer: GenerateOptions<PublicKeyCredentialRequestOptionsJSON> =
      await responseFromTheServer.json();

    if (unmarshalledResponseFromTheServer.status === "error") {
      throw new Error(unmarshalledResponseFromTheServer.error);
    }

    // starting the authentication

    const authResponse = await startAuthentication(
      unmarshalledResponseFromTheServer.options
    );

    type x = AuthenticationResponseJSON;

    const verificationResponse = await fetch(
      "/api/webauth/verify-authentication",
      {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          challenge: unmarshalledResponseFromTheServer.challenge.challenge,
          response: authResponse,
          transports: unmarshalledResponseFromTheServer.transports,
        } as ClientGenerateOptions<AuthenticationResponseJSON>),
      }
    );

    const verificationJSON =
      (await verificationResponse.json()) as VerifyOptions;

    if (verificationJSON.status === "error") {
      throw new Error(verificationJSON.error);
    }

    if (verificationJSON.status === "success" && verificationJSON.verified) {
      setIsSigned("success");
      return true;
    }
  } catch (error) {
    setIsSigned("error");
    error instanceof Error
      ? toast.error(`${error.name}: ${error.message}`)
      : toast.error(`An error occured! Please try again.`);
  }
};
