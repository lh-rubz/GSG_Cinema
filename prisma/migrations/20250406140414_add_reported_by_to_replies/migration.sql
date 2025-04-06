-- AlterTable
ALTER TABLE "Reply" ADD COLUMN     "reportedBy" TEXT[] DEFAULT ARRAY[]::TEXT[];
