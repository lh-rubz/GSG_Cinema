/*
  Warnings:

  - The primary key for the `ReplyReport` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropIndex
DROP INDEX "ReplyReport_replyId_userId_key";

-- AlterTable
ALTER TABLE "ReplyReport" DROP CONSTRAINT "ReplyReport_pkey",
ADD CONSTRAINT "ReplyReport_pkey" PRIMARY KEY ("replyId", "userId");
