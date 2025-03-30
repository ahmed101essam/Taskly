/*
  Warnings:

  - You are about to drop the column `created_by` on the `comment` table. All the data in the column will be lost.
  - You are about to drop the column `targetId` on the `notifications` table. All the data in the column will be lost.
  - Made the column `targetType` on table `notifications` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "NotificationType" ADD VALUE 'COMMENT';
ALTER TYPE "NotificationType" ADD VALUE 'TASKREMOVAL';

-- AlterEnum
ALTER TYPE "TargetType" ADD VALUE 'COMMENT';

-- AlterTable
ALTER TABLE "comment" DROP COLUMN "created_by";

-- AlterTable
ALTER TABLE "notifications" DROP COLUMN "targetId",
ADD COLUMN     "comment_id" INTEGER,
ADD COLUMN     "project_id" INTEGER,
ADD COLUMN     "task_id" INTEGER,
ALTER COLUMN "targetType" SET NOT NULL;
