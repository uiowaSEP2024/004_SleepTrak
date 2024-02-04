/*
  Warnings:

  - Added the required column `Status` to the `Plan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `planId` to the `Reminder` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Plan" ADD COLUMN     "Status" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Reminder" ADD COLUMN     "planId" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "Reminder" ADD CONSTRAINT "Reminder_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("planId") ON DELETE RESTRICT ON UPDATE CASCADE;
