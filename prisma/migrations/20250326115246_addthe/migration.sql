-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('INVITATION', 'MESSAGE', 'TASK_UPDATE', 'GENERAL');

-- CreateEnum
CREATE TYPE "TargetType" AS ENUM ('PROJECT', 'TASK', 'MESSAGE', 'USER_PROFILE');

-- CreateTable
CREATE TABLE "notifications" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "type" "NotificationType" NOT NULL,
    "message" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "targetId" INTEGER,
    "targetType" "TargetType",
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
