import { relations } from "drizzle-orm";
import {
  pgTable,
  serial,
  text,
  timestamp,
  pgEnum,
  uuid,
  uniqueIndex,
  numeric,
  customType,
  bigint,
  boolean,
} from "drizzle-orm/pg-core";

const bytea = customType<{ data: Uint8Array; notNull: true; default: false }>({
  dataType() {
    return "bytea";
  },

  toDriver(value: Uint8Array) {
    return Buffer.from(value).toString("base64");
  },

  fromDriver(val) {
    return new Uint8Array(Buffer.from(val as string, "base64"));
  },
});

export const roleEnum = pgEnum("role", ["Admin", "Dev", "QA"]);
export const permissionsEnum = pgEnum("permissions", [
  "Read",
  "Write",
  "AddMembers",
]);

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  firstName: text("firstName"),
  lastName: text("lastName"),
  email: text("email").notNull().unique(),
  username: text("username").notNull().unique(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt"),
  avatar: text("avatar"),
  githubId: text("githubId").unique(),
});

export const members = pgTable(
  "members",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    role: roleEnum("role").notNull(),
    permissions: permissionsEnum("permissions").array().notNull(),
    createdAt: timestamp("createdAt").defaultNow(),
    updatedAt: timestamp("updatedAt"),
    ownerId: text("ownerId")
      .references(() => users.id, {
        onDelete: "cascade",
      })
      .notNull(),
    workspaceId: uuid("workspaceId")
      .references(() => workspaces.id, {
        onDelete: "cascade",
      })
      .notNull(),
  },

  (members) => {
    return {
      workspaceAndUserConstraint: uniqueIndex("memberConstraint").on(
        members.ownerId,
        members.workspaceId
      ),
    };
  }
);

export const workspaces = pgTable("workspaces", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt"),
});

export const secrets = pgTable("secrets", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  secret: text("secret").notNull(),
  salt: text("salt").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  workspaceId: uuid("workspaceId")
    .references(() => workspaces.id, {
      onDelete: "cascade",
    })
    .notNull()
    .unique(),
});

export const environmentFiles = pgTable("environmentFiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt"),
  workspaceId: uuid("workspaceId")
    .references(() => workspaces.id, {
      onDelete: "cascade",
    })
    .notNull(),
});

export const environmentMode = pgTable(
  "environmentMode",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("text").notNull(),
    createdAt: timestamp("createdAt").defaultNow(),
    updatedAt: timestamp("updatedAt"),
    environmentFileId: uuid("environmentFileId")
      .references(() => workspaces.id, {
        onDelete: "cascade",
      })
      .notNull(),
  },
  (mode) => {
    return {
      modeConstraint: uniqueIndex("modeConstraint").on(
        mode.environmentFileId,
        mode.name
      ),
    };
  }
);

export const variables = pgTable("variables", {
  id: uuid("id").primaryKey().defaultRandom(),
  key: text("key").notNull(),
  value: text("value").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt"),
  readCount: numeric("readCount").notNull().default("0"),
  environmentModeId: uuid("environmentModeId")
    .references(() => environmentMode.id, {
      onDelete: "cascade",
    })
    .notNull(),
});

export const sessions = pgTable("session", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});

// webauth table

export const authenticators = pgTable("authenticators", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("userId")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  credentialId: text("credentialId").notNull(),
  credentialPublicKey: text("credentialPublicKey").notNull(),
  counter: bigint("counter", { mode: "number" }).notNull(),
  credentialDeviceType: text("credentialDeviceType").notNull(),
  credentialBackedup: boolean("credentialBackedup").notNull(),
  transports: text("transports").array(),
});

// RELATIONS

export const userRelations = relations(users, ({ many }) => ({
  members: many(members),
  authenticators: many(authenticators),
}));

export const memberRelations = relations(members, ({ one }) => ({
  user: one(users, {
    fields: [members.ownerId],
    references: [users.id],
  }),
  workspace: one(workspaces, {
    fields: [members.workspaceId],
    references: [workspaces.id],
  }),
}));

export const workspaceRelations = relations(workspaces, ({ many, one }) => ({
  members: many(members),
  secret: one(secrets),
  environmentFiles: many(environmentFiles),
}));

export const environmentFilesRelations = relations(
  environmentFiles,
  ({ many, one }) => ({
    environmentModes: many(environmentMode),
    workspace: one(workspaces, {
      fields: [environmentFiles.workspaceId],
      references: [workspaces.id],
    }),
  })
);

export const environmentModesRelations = relations(
  environmentMode,
  ({ one, many }) => ({
    file: one(environmentFiles, {
      references: [environmentFiles.id],
      fields: [environmentMode.environmentFileId],
    }),
    many: many(environmentMode),
  })
);

export const variablesRelations = relations(variables, ({ one }) => ({
  environmentMode: one(environmentMode, {
    references: [environmentMode.id],
    fields: [variables.environmentModeId],
  }),
}));
