-- AlterEnum
ALTER TYPE "NotificationType" ADD VALUE 'PROJECTLEAVE';

-- AlterTable
ALTER TABLE "project" ALTER COLUMN "description" SET DATA TYPE VARCHAR(200);
