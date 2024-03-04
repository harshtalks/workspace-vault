ALTER TABLE "authenticators" ALTER COLUMN "credentialId" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "authenticators" ALTER COLUMN "credentialPublicKey" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "authenticators" ALTER COLUMN "credentialDeviceType" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "authenticators" ALTER COLUMN "credentialBackedup" SET NOT NULL;