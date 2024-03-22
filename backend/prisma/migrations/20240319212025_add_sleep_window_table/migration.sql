-- CreateTable
CREATE TABLE "SleepWindow" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "startTime" TIMESTAMPTZ NOT NULL,
    "stopTime" TIMESTAMPTZ NOT NULL,
    "isSleep" BOOLEAN NOT NULL,
    "notes" TEXT NOT NULL,

    CONSTRAINT "SleepWindow_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SleepWindow" ADD CONSTRAINT "SleepWindow_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("eventId") ON DELETE RESTRICT ON UPDATE CASCADE;
