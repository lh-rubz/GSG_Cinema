-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('PENDING', 'RESOLVED', 'DISMISSED');

-- CreateEnum
CREATE TYPE "ReportContentType" AS ENUM ('REVIEW', 'REPLY');

-- AlterTable
ALTER TABLE "Reply" ADD COLUMN     "reportedBy" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "reportedBy" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- CreateTable
CREATE TABLE "ReportedContent" (
    "id" TEXT NOT NULL,
    "reporterId" TEXT NOT NULL,
    "reason" TEXT,
    "status" "ReportStatus" NOT NULL DEFAULT 'PENDING',
    "reportDate" TEXT NOT NULL,
    "contentType" "ReportContentType" NOT NULL,
    "reviewId" TEXT,
    "replyId" TEXT,

    CONSTRAINT "ReportedContent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ReportedContent_reporterId_idx" ON "ReportedContent"("reporterId");

-- CreateIndex
CREATE INDEX "ReportedContent_reviewId_idx" ON "ReportedContent"("reviewId");

-- CreateIndex
CREATE INDEX "ReportedContent_replyId_idx" ON "ReportedContent"("replyId");

-- CreateIndex
CREATE INDEX "ReportedContent_status_idx" ON "ReportedContent"("status");

-- AddForeignKey
ALTER TABLE "ReportedContent" ADD CONSTRAINT "ReportedContent_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportedContent" ADD CONSTRAINT "ReportedContent_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "Review"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportedContent" ADD CONSTRAINT "ReportedContent_replyId_fkey" FOREIGN KEY ("replyId") REFERENCES "Reply"("id") ON DELETE SET NULL ON UPDATE CASCADE;
