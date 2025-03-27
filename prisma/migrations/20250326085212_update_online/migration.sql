/*
  Warnings:

  - You are about to drop the column `invitationToken` on the `project_member` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "project_member" DROP COLUMN "invitationToken";

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "online" BOOLEAN NOT NULL DEFAULT false;
