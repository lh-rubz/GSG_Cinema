/*
  Warnings:

  - Added the required column `character` to the `CastMember` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CastMember" ADD COLUMN     "character" TEXT NOT NULL;
