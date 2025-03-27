/*
  Warnings:

  - Added the required column `invitationToken` to the `project_member` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "InvitationStatus" AS ENUM ('PENDING', 'ACCEPTED');

-- AlterTable
ALTER TABLE "project_member" ADD COLUMN     "invitationStatus" "InvitationStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "invitationToken" VARCHAR(200) NOT NULL;
