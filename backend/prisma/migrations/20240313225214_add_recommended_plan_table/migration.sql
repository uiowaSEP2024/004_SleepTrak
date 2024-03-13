-- CreateTable
CREATE TABLE "RecommendedPlan" (
    "ageInMonth" TEXT NOT NULL,
    "numOfNaps" INTEGER NOT NULL,
    "wakeWindow" INTEGER NOT NULL,

    CONSTRAINT "RecommendedPlan_pkey" PRIMARY KEY ("ageInMonth")
);
