-- CreateEnum
CREATE TYPE "MemberRole" AS ENUM ('MANAGER', 'MEMBER');

-- AlterTable
ALTER TABLE "project_member" ADD COLUMN     "role" "MemberRole" NOT NULL DEFAULT 'MEMBER';
