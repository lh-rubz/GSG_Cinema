-- CreateEnum
CREATE TYPE "TimeFormat" AS ENUM ('TWELVE_HOUR', 'TWENTY_FOUR_HOUR');

-- CreateEnum
CREATE TYPE "DurationFormat" AS ENUM ('MINUTES_ONLY', 'HOURS_AND_MINUTES');

-- CreateEnum
CREATE TYPE "CurrencyType" AS ENUM ('USD', 'NIS');

-- CreateTable
CREATE TABLE "UserPreferences" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "timeFormat" "TimeFormat" NOT NULL DEFAULT 'TWENTY_FOUR_HOUR',
    "durationFormat" "DurationFormat" NOT NULL DEFAULT 'MINUTES_ONLY',
    "currency" "CurrencyType" NOT NULL DEFAULT 'NIS',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserPreferences_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserPreferences_userId_key" ON "UserPreferences"("userId");

-- CreateIndex
CREATE INDEX "UserPreferences_userId_idx" ON "UserPreferences"("userId");

-- AddForeignKey
ALTER TABLE "UserPreferences" ADD CONSTRAINT "UserPreferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
