/*
  Warnings:

  - You are about to drop the column `invitationStatus` on the `project_member` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "MemberStatus" AS ENUM ('JOINED', 'LEFT', 'REMOVED', 'INVITATIONPENDING');

-- AlterTable
ALTER TABLE "project_member" DROP COLUMN "invitationStatus",
ADD COLUMN     "memberStatus" "MemberStatus" NOT NULL DEFAULT 'INVITATIONPENDING';
