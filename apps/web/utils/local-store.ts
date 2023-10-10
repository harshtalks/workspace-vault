import { generateMasterKey, getSalt } from "cryptography";
import Dexie from "dexie";

// Define your database schema using Dexie.js
class WorkspaceVault extends Dexie {
  secrets: Dexie.Table<{ workspace: string; key: string }, string>;

  constructor() {
    super("WorkspaceVault");
    this.version(0.1).stores({
      secrets: "workspace", // Set 'userId' as the key path
    });

    // Access the table you defined
    this.secrets = this.table("secrets");
  }
}

export const secretDB = new WorkspaceVault();

export const localKeyForBrowser = async () => {
  if (
    !process.env.NEXT_PUBLIC_SECRET_FOR_GENERATING_KEY ||
    !process.env.NEXT_PUBLIC_SECRET_FOR_GENERATING_KEY_WEB
  ) {
    throw new Error("Error ocurred while generating the master key.");
  }

  return generateMasterKey(
    process.env.NEXT_PUBLIC_SECRET_FOR_GENERATING_KEY_WEB,
    getSalt(process.env.NEXT_PUBLIC_SECRET_FOR_GENERATING_KEY)
  );
};
