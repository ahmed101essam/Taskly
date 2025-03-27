/*
  Warnings:

  - Added the required column `first_name` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `last_name` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user" ADD COLUMN     "first_name" VARCHAR(60) NOT NULL,
ADD COLUMN     "last_name" VARCHAR(60) NOT NULL;
