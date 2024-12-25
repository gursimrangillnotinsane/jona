/*
  Warnings:

  - Added the required column `user` to the `Dairy` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Dairy" ADD COLUMN     "user" TEXT NOT NULL;
