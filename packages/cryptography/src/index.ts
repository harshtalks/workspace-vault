import "dotenv/config";
console.log(process.env);

export const generateMasterKey = async (secret: string, salt: Uint8Array) => {
  // Define the initial key material (e.g., an AES key)
  try {
    const encoder = new TextEncoder();

    const encodedSecret = encoder.encode(secret);

    // Import the initial key using async/await
    const importedKey = await window.crypto.subtle.importKey(
      "raw",
      encodedSecret,
      { name: "PBKDF2" },
      false,
      ["deriveBits", "deriveKey"]
    );

    // Derive a new key from the initial key using async/await
    const derivedKey = await window.crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: salt,
        iterations: 100000,
        hash: "SHA-256",
      },
      importedKey,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt", "decrypt"]
    );

    // 'derivedKey' is the derived cryptographic key
    return derivedKey;
  } catch (error) {
    console.error("Error deriving key:", error);
  }
};

export const getSalt = (str: string) => {
  return new Uint8Array(Buffer.from(str));
};

export async function encryptTextWithAESGCM(
  text: string,
  encryptionKey: CryptoKey
) {
  try {
    // Encode the text as UTF-8
    const textEncoder = new TextEncoder();
    const encodedData = textEncoder.encode(text);

    // Generate a random IV (Initialization Vector)
    const iv = window.crypto.getRandomValues(new Uint8Array(12));

    // Define the AES-GCM encryption parameters
    const aesGcmParams = { name: "AES-GCM", iv: iv };

    // Encrypt the data using the derived key and AES-GCM
    const encryptedData = await window.crypto.subtle.encrypt(
      aesGcmParams,
      encryptionKey,
      encodedData
    );

    // Convert the encrypted data to a base64-encoded string for storage or transmission
    const concatenatedBuffer = await new Blob([
      iv,
      encryptedData,
    ]).arrayBuffer();

    // returning the blob
    return toBase64(concatenatedBuffer);
  } catch (error) {
    console.error("Error encrypting text:", error);
  }
}

export async function decryptTextWithAESGCM(
  encryptedText: string,
  encryptionKey: CryptoKey
) {
  try {
    // Decode the base64-encoded encrypted text
    const encryptedData = fromBase64(encryptedText);

    // initialization vector
    const iv = encryptedData.slice(0, 12);

    // cipher text
    const cipherText = encryptedData.slice(12);

    // Define the AES-GCM decryption parameters
    const aesGcmParams = { name: "AES-GCM", iv: iv };

    // Decrypt the ciphertext using the derived key and AES-GCM
    const decryptedData = await window.crypto.subtle.decrypt(
      aesGcmParams,
      encryptionKey,
      cipherText
    );

    // Decode the decrypted data as UTF-8 to obtain the original text
    const textDecoder = new TextDecoder();
    const decryptedText = textDecoder.decode(decryptedData);

    return decryptedText;
  } catch (error) {
    console.error("Error decrypting text:", error);
  }
}

const toBase64 = (buffer: ArrayBuffer) =>
  window.btoa(String.fromCharCode(...Array.from(new Uint8Array(buffer))));

const fromBase64 = (buffer: string) =>
  Uint8Array.from(window.atob(buffer), (c) => c.charCodeAt(0));

// generate secret

export const generatePassword = (): string => {
  return window.crypto
    .getRandomValues(new BigUint64Array(4))
    .reduce<string>(
      (prev, curr, index) =>
        (!index ? prev : prev.toString()) +
        (index % 2 ? curr.toString(36).toUpperCase() : curr.toString(36)),
      ""
    )
    .split("")
    .sort(() => 128 - window.crypto.getRandomValues(new Uint8Array(1))[0])
    .join("");
};
