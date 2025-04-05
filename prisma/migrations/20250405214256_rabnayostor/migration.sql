-- DropForeignKey
ALTER TABLE "task" DROP CONSTRAINT "task_assigned_to_fkey";

-- DropForeignKey
ALTER TABLE "task" DROP CONSTRAINT "task_created_by_fkey";

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "task_created_by_project_id_fkey" FOREIGN KEY ("created_by", "project_id") REFERENCES "project_member"("user_id", "project_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "task_assigned_to_project_id_fkey" FOREIGN KEY ("assigned_to", "project_id") REFERENCES "project_member"("user_id", "project_id") ON DELETE RESTRICT ON UPDATE CASCADE;
