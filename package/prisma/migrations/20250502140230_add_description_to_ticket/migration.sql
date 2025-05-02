/*
  Warnings:

  - Added the required column `assignee` to the `Ticket` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Ticket" ADD COLUMN     "assignee" TEXT NOT NULL;
