/*
  Warnings:

  - You are about to drop the column `question` on the `OnboardingAnswer` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Baby" ALTER COLUMN "weight" DROP NOT NULL;

-- AlterTable
ALTER TABLE "OnboardingAnswer" DROP COLUMN "question";

-- AddForeignKey
ALTER TABLE "OnboardingAnswer" ADD CONSTRAINT "OnboardingAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "OnboardingQuestion"("questionId") ON DELETE RESTRICT ON UPDATE CASCADE;
