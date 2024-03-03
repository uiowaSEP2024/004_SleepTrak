-- CreateTable
CREATE TABLE "Question" (
    "questionId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "onboarding_screen" INTEGER NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("questionId")
);
