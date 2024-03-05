/*
  Warnings:

  - You are about to drop the `Question` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Question";

-- CreateTable
CREATE TABLE "OnboardingQuestion" (
    "questionId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "onboarding_screen" INTEGER NOT NULL,

    CONSTRAINT "OnboardingQuestion_pkey" PRIMARY KEY ("questionId")
);

-- CreateTable
CREATE TABLE "OnboardingAnswer" (
    "answerId" TEXT NOT NULL,
    "answer_text" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "babyId" TEXT NOT NULL,

    CONSTRAINT "OnboardingAnswer_pkey" PRIMARY KEY ("answerId")
);

-- AddForeignKey
ALTER TABLE "OnboardingAnswer" ADD CONSTRAINT "OnboardingAnswer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OnboardingAnswer" ADD CONSTRAINT "OnboardingAnswer_babyId_fkey" FOREIGN KEY ("babyId") REFERENCES "Baby"("babyId") ON DELETE RESTRICT ON UPDATE CASCADE;
