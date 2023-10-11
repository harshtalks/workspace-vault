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
 * @description handle the webAuth Registration process
 */

// pscale_pw_sPobWBs3TWpHzL46YWaMAW2VbQLMY3UBrRd7DR9RthV

export const webAuthnHandler = async (
  setIsSigned: React.Dispatch<React.SetStateAction<WebAuthSignedStates>>
) => {
  try {
    setIsSigned("isPending");
    // getting the registration options
    const responseFromTheServer = await fetch("/api/webauth/register");

    const unmarshallResponseFromTheServer =
      (await responseFromTheServer.json()) as GenerateOptions<PublicKeyCredentialCreationOptionsJSON>;

    if (unmarshallResponseFromTheServer.status === "error") {
      throw new Error(unmarshallResponseFromTheServer.error);
    }

    const authResponse = await startRegistration(
      unmarshallResponseFromTheServer.options
    );

    const verificationResponse = await fetch("/api/webauth/verify-register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        response: authResponse,
        challenge: unmarshallResponseFromTheServer.challenge.challenge,
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

    // unmarshall

    const unmarshalledResponseFromTheServer: GenerateOptions<PublicKeyCredentialRequestOptionsJSON> =
      await responseFromTheServer.json();

    if (unmarshalledResponseFromTheServer.status === "error") {
      throw new Error(unmarshalledResponseFromTheServer.error);
    }

    // starting the authentication

    const authResponse = await startAuthentication(
      unmarshalledResponseFromTheServer.options
    );

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
