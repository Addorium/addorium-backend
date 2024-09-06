-- CreateEnum
CREATE TYPE "ProjectVisibility" AS ENUM ('PUBLIC', 'PRIVATE');

-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('DRAFT', 'MODERATION', 'PUBLISHED');

-- CreateTable
CREATE TABLE "Blueprints" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "visibility" "ProjectVisibility" NOT NULL DEFAULT 'PUBLIC',
    "status" "ProjectStatus" DEFAULT 'DRAFT',
    "icon" TEXT DEFAULT 'https://cdn.discordapp.com/embed/avatars/0.png',
    "banner" TEXT DEFAULT 'https://cdn.discordapp.com/embed/avatars/0.png',
    "description" TEXT DEFAULT 'Please add a description',
    "category" TEXT DEFAULT 'Other',
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "fileUrl" TEXT DEFAULT '',
    "ownerId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Blueprints_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Scripts" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "visibility" "ProjectVisibility" NOT NULL DEFAULT 'PUBLIC',
    "status" "ProjectStatus" DEFAULT 'DRAFT',
    "icon" TEXT DEFAULT 'https://cdn.discordapp.com/embed/avatars/0.png',
    "banner" TEXT DEFAULT 'https://cdn.discordapp.com/embed/avatars/0.png',
    "description" TEXT DEFAULT 'Please add a description',
    "code" TEXT DEFAULT 'Please add a code',
    "ownerId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Scripts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Themes" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "visibility" "ProjectVisibility" NOT NULL DEFAULT 'PUBLIC',
    "status" "ProjectStatus" DEFAULT 'DRAFT',
    "description" TEXT,
    "icon" TEXT DEFAULT 'https://cdn.discordapp.com/embed/avatars/0.png',
    "banner" TEXT DEFAULT 'https://cdn.discordapp.com/embed/avatars/0.png',
    "theme" TEXT,
    "ownerId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Themes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlueprintsImages" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT DEFAULT '',
    "url" TEXT NOT NULL,
    "blueprintId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "BlueprintsImages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScriptImages" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT DEFAULT '',
    "url" TEXT NOT NULL,
    "scriptId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ScriptImages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ThemeImages" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT DEFAULT '',
    "url" TEXT NOT NULL,
    "themeId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ThemeImages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Blueprints_slug_key" ON "Blueprints"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Scripts_slug_key" ON "Scripts"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Themes_slug_key" ON "Themes"("slug");

-- AddForeignKey
ALTER TABLE "Blueprints" ADD CONSTRAINT "Blueprints_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Scripts" ADD CONSTRAINT "Scripts_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Themes" ADD CONSTRAINT "Themes_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlueprintsImages" ADD CONSTRAINT "BlueprintsImages_blueprintId_fkey" FOREIGN KEY ("blueprintId") REFERENCES "Blueprints"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScriptImages" ADD CONSTRAINT "ScriptImages_scriptId_fkey" FOREIGN KEY ("scriptId") REFERENCES "Scripts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ThemeImages" ADD CONSTRAINT "ThemeImages_themeId_fkey" FOREIGN KEY ("themeId") REFERENCES "Themes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
