-- CreateEnum
CREATE TYPE "Goal" AS ENUM ('FAT_LOSS', 'MUSCLE_GAIN', 'RECOMPOSITION', 'MAINTENANCE');

-- CreateEnum
CREATE TYPE "TrainingLevel" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "DietType" AS ENUM ('VEGETARIAN', 'NON_VEGETARIAN', 'VEGAN', 'EGGETARIAN', 'PESCATARIAN', 'JAIN', 'GLUTEN_FREE', 'LACTOSE_FREE');

-- CreateTable
CREATE TABLE "GymSettings" (
    "id" TEXT NOT NULL,
    "gymName" TEXT NOT NULL,
    "logoUrl" TEXT,
    "address" TEXT,
    "phone" TEXT,
    "tagline" TEXT,
    "primaryColor" TEXT NOT NULL DEFAULT '#1a56db',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GymSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Member" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "age" INTEGER NOT NULL,
    "gender" "Gender" NOT NULL,
    "height" DOUBLE PRECISION NOT NULL,
    "goal" "Goal" NOT NULL,
    "trainingLevel" "TrainingLevel" NOT NULL,
    "joinDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DietaryProfile" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "dietType" "DietType" NOT NULL DEFAULT 'NON_VEGETARIAN',
    "mealsPerDay" INTEGER NOT NULL DEFAULT 3,
    "eatsBreakfast" BOOLEAN NOT NULL DEFAULT true,
    "eatsLunch" BOOLEAN NOT NULL DEFAULT true,
    "eatsDinner" BOOLEAN NOT NULL DEFAULT true,
    "frequentSnacking" BOOLEAN NOT NULL DEFAULT false,
    "lateNightEating" BOOLEAN NOT NULL DEFAULT false,
    "supplementsAllowed" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "DietaryProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Assessment" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "weight" DOUBLE PRECISION NOT NULL,
    "bmi" DOUBLE PRECISION NOT NULL,
    "bodyFat" DOUBLE PRECISION NOT NULL,
    "musclePct" DOUBLE PRECISION NOT NULL,
    "visceralFat" DOUBLE PRECISION NOT NULL,
    "subcutaneousFat" DOUBLE PRECISION,
    "bmr" DOUBLE PRECISION,
    "metabolicAge" INTEGER,
    "bodyWater" DOUBLE PRECISION,
    "proteinPct" DOUBLE PRECISION,
    "boneMass" DOUBLE PRECISION,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Assessment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Member_memberId_key" ON "Member"("memberId");

-- CreateIndex
CREATE UNIQUE INDEX "DietaryProfile_memberId_key" ON "DietaryProfile"("memberId");

-- CreateIndex
CREATE INDEX "Assessment_memberId_date_idx" ON "Assessment"("memberId", "date");

-- AddForeignKey
ALTER TABLE "DietaryProfile" ADD CONSTRAINT "DietaryProfile_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assessment" ADD CONSTRAINT "Assessment_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

