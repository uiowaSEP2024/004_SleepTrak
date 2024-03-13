-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "amount" DOUBLE PRECISION,
ADD COLUMN     "foodType" TEXT,
ADD COLUMN     "note" TEXT,
ADD COLUMN     "unit" TEXT,
ALTER COLUMN "endTime" DROP NOT NULL;
