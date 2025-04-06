/*
  Warnings:

  - You are about to drop the column `reportedBy` on the `Reply` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Reply" DROP COLUMN "reportedBy";

-- CreateTable
CREATE TABLE "ReplyReport" (
    "id" TEXT NOT NULL,
    "replyId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReplyReport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ReplyReport_replyId_idx" ON "ReplyReport"("replyId");

-- CreateIndex
CREATE INDEX "ReplyReport_userId_idx" ON "ReplyReport"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ReplyReport_replyId_userId_key" ON "ReplyReport"("replyId", "userId");

-- AddForeignKey
ALTER TABLE "ReplyReport" ADD CONSTRAINT "ReplyReport_replyId_fkey" FOREIGN KEY ("replyId") REFERENCES "Reply"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReplyReport" ADD CONSTRAINT "ReplyReport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
