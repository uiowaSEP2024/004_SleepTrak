/*
  Warnings:

  - You are about to drop the column `timestamp` on the `Reminder` table. All the data in the column will be lost.
  - Added the required column `startTime` to the `Reminder` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Reminder" DROP COLUMN "timestamp",
ADD COLUMN     "endTime" TIMESTAMPTZ,
ADD COLUMN     "startTime" TIMESTAMPTZ NOT NULL;
