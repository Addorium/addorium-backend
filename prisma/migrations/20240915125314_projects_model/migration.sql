/*
  Warnings:

  - You are about to drop the `Blueprints` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BlueprintsImages` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ScriptImages` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Scripts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ThemeImages` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Themes` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "ProjectType" AS ENUM ('BLUEPRINT', 'SCRIPT', 'THEME');

-- DropForeignKey
ALTER TABLE "Blueprints" DROP CONSTRAINT "Blueprints_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "BlueprintsImages" DROP CONSTRAINT "BlueprintsImages_blueprintId_fkey";

-- DropForeignKey
ALTER TABLE "ScriptImages" DROP CONSTRAINT "ScriptImages_scriptId_fkey";

-- DropForeignKey
ALTER TABLE "Scripts" DROP CONSTRAINT "Scripts_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "ThemeImages" DROP CONSTRAINT "ThemeImages_themeId_fkey";

-- DropForeignKey
ALTER TABLE "Themes" DROP CONSTRAINT "Themes_ownerId_fkey";

-- DropTable
DROP TABLE "Blueprints";

-- DropTable
DROP TABLE "BlueprintsImages";

-- DropTable
DROP TABLE "ScriptImages";

-- DropTable
DROP TABLE "Scripts";

-- DropTable
DROP TABLE "ThemeImages";

-- DropTable
DROP TABLE "Themes";

-- CreateTable
CREATE TABLE "Projects" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "type" "ProjectType" NOT NULL DEFAULT 'BLUEPRINT',
    "visibility" "ProjectVisibility" NOT NULL DEFAULT 'PUBLIC',
    "status" "ProjectStatus" DEFAULT 'DRAFT',
    "icon" TEXT DEFAULT 'default.webp',
    "banner" TEXT DEFAULT 'default.webp',
    "description" TEXT DEFAULT 'Please add a description',
    "category" TEXT DEFAULT 'Other',
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "fileUrl" TEXT DEFAULT '',
    "ownerId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectsImages" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT DEFAULT '',
    "url" TEXT NOT NULL,
    "blueprintId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ProjectsImages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Projects_slug_key" ON "Projects"("slug");

-- AddForeignKey
ALTER TABLE "Projects" ADD CONSTRAINT "Projects_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectsImages" ADD CONSTRAINT "ProjectsImages_blueprintId_fkey" FOREIGN KEY ("blueprintId") REFERENCES "Projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
