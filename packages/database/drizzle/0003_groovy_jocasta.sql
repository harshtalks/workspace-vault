DO $$ BEGIN
 CREATE TYPE "credentialsDeviceType" AS ENUM('singleDevice', 'multiDevice');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
