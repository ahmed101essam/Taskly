/*
  Warnings:

  - The values [USER_PROFILE] on the enum `TargetType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
ALTER TYPE "MemberRole" ADD VALUE 'SUPERVISOR';

-- AlterEnum
ALTER TYPE "NotificationType" ADD VALUE 'PROJECTPROMOTION';

-- AlterEnum
BEGIN;
CREATE TYPE "TargetType_new" AS ENUM ('PROJECT', 'TASK', 'MESSAGE', 'USERPROFILE');
ALTER TABLE "notifications" ALTER COLUMN "targetType" TYPE "TargetType_new" USING ("targetType"::text::"TargetType_new");
ALTER TYPE "TargetType" RENAME TO "TargetType_old";
ALTER TYPE "TargetType_new" RENAME TO "TargetType";
DROP TYPE "TargetType_old";
COMMIT;
