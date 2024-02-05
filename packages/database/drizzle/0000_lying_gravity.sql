DO $$ BEGIN
 CREATE TYPE "permissions" AS ENUM('Read', 'Write', 'AddMembers');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "role" AS ENUM('Admin', 'Dev', 'QA');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "authenticators" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" text NOT NULL,
	"credentialId" "bytea",
	"credentialPublicKey" "bytea",
	"counter" bigint,
	"credentialDeviceType" text,
	"credentialBackedup" boolean,
	"transports" text[]
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "environmentFiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp,
	"workspaceId" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "environmentMode" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"text" text NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp,
	"environmentFileId" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "members" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"role" "role" NOT NULL,
	"permissions" permissions[] NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp,
	"ownerId" text NOT NULL,
	"workspaceId" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "secrets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"secret" text NOT NULL,
	"salt" text NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"workspaceId" uuid NOT NULL,
	CONSTRAINT "secrets_workspaceId_unique" UNIQUE("workspaceId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" text PRIMARY KEY NOT NULL,
	"firstName" text,
	"lastName" text,
	"email" text NOT NULL,
	"username" text NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "variables" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" text NOT NULL,
	"value" text NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp,
	"readCount" numeric DEFAULT '0' NOT NULL,
	"environmentModeId" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "workspaces" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "modeConstraint" ON "environmentMode" ("environmentFileId","text");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "memberConstraint" ON "members" ("ownerId","workspaceId");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "authenticators" ADD CONSTRAINT "authenticators_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "environmentFiles" ADD CONSTRAINT "environmentFiles_workspaceId_workspaces_id_fk" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "environmentMode" ADD CONSTRAINT "environmentMode_environmentFileId_workspaces_id_fk" FOREIGN KEY ("environmentFileId") REFERENCES "workspaces"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "members" ADD CONSTRAINT "members_ownerId_users_id_fk" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "members" ADD CONSTRAINT "members_workspaceId_workspaces_id_fk" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "secrets" ADD CONSTRAINT "secrets_workspaceId_workspaces_id_fk" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "variables" ADD CONSTRAINT "variables_environmentModeId_environmentMode_id_fk" FOREIGN KEY ("environmentModeId") REFERENCES "environmentMode"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
