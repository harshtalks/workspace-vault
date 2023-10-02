import {
  PublicKeyCredentialCreationOptionsJSON,
  RegistrationResponseJSON,
} from "@simplewebauthn/server/script/deps";

export type CredentialDeviceType = "singleDevice" | "multiDevice";

export type Authenticator = {
  // SQL: Encode to base64url then store as `TEXT`. Index this column
  credentialID: Uint8Array;
  // SQL: Store raw bytes as `BYTEA`/`BLOB`/etc...
  credentialPublicKey: Uint8Array;
  // SQL: Consider `BIGINT` since some authenticators return atomic timestamps as counters
  counter: BigInt;
  // SQL: `VARCHAR(32)` or similar, longest possible value is currently 12 characters
  // Ex: 'singleDevice' | 'multiDevice'
  credentialDeviceType: CredentialDeviceType;
  // SQL: `BOOL` or whatever similar type is supported
  credentialBackedUp: boolean;
  // SQL: `VARCHAR(255)` and store string array as a CSV string
  // Ex: ['usb' | 'ble' | 'nfc' | 'internal']
  transports?: AuthenticatorTransport[];
};

export type GenerateOptionsSuccess<TOptions> = {
  status: "success";
  options: TOptions;
  challenge: {
    userId: string;
    challenge: string;
  };
  transports: AuthenticatorTransport[];
};

export type GenerateOptionsError = {
  status: "error";
  error: string;
};

export type GenerateOptions<TOptions> =
  | GenerateOptionsError
  | GenerateOptionsSuccess<TOptions>;

export type VerifyOptionsSuccess = {
  status: "success";
  verified: boolean;
  key?: string;
};

export type VerifyOptions = VerifyOptionsSuccess | GenerateOptionsError;

export type ClientGenerateOptions<TOptions> = {
  challenge: string;
  response: TOptions;
  transports: AuthenticatorTransport[];
};
