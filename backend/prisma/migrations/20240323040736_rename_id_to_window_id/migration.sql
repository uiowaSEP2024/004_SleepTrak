/*
  Warnings:

  - The primary key for the `SleepWindow` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `SleepWindow` table. All the data in the column will be lost.
  - The required column `windowId` was added to the `SleepWindow` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "SleepWindow" DROP CONSTRAINT "SleepWindow_pkey",
DROP COLUMN "id",
ADD COLUMN     "windowId" TEXT NOT NULL,
ADD CONSTRAINT "SleepWindow_pkey" PRIMARY KEY ("windowId");
