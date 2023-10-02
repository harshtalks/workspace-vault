import Dexie from "dexie";

// Define your database schema using Dexie.js
class WorkspaceVault extends Dexie {
  secrets: Dexie.Table<{ workspace: string; key: CryptoKey }, string>;

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
