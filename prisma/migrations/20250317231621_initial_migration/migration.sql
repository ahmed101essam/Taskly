-- AlterTable
ALTER TABLE "comment" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "project_member" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "task" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true;
