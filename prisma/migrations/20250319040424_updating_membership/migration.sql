/*
  Warnings:

  - You are about to drop the column `role` on the `project_member` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "project_member" DROP COLUMN "role",
ALTER COLUMN "invitationToken" DROP NOT NULL;
