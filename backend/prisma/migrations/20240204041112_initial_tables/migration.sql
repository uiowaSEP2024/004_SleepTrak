/*
  Warnings:

  - You are about to drop the `Test` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Test";

-- CreateTable
CREATE TABLE "User" (
    "userId" UUID NOT NULL,
    "coachId" UUID,
    "role" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Event" (
    "eventId" UUID NOT NULL,
    "ownerId" UUID NOT NULL,
    "startTime" TIMESTAMPTZ NOT NULL,
    "endTime" TIMESTAMPTZ NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("eventId")
);

-- CreateTable
CREATE TABLE "Plan" (
    "planId" UUID NOT NULL,
    "clientId" UUID NOT NULL,
    "coachId" UUID NOT NULL,

    CONSTRAINT "Plan_pkey" PRIMARY KEY ("planId")
);

-- CreateTable
CREATE TABLE "Reminder" (
    "reminderId" UUID NOT NULL,
    "description" TEXT NOT NULL,
    "timestamp" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "Reminder_pkey" PRIMARY KEY ("reminderId")
);

-- CreateTable
CREATE TABLE "Baby" (
    "babyId" UUID NOT NULL,
    "parentId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "dob" DATE NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "medicine" TEXT NOT NULL,

    CONSTRAINT "Baby_pkey" PRIMARY KEY ("babyId")
);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_coachId_fkey" FOREIGN KEY ("coachId") REFERENCES "User"("userId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Plan" ADD CONSTRAINT "Plan_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Plan" ADD CONSTRAINT "Plan_coachId_fkey" FOREIGN KEY ("coachId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Baby" ADD CONSTRAINT "Baby_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
