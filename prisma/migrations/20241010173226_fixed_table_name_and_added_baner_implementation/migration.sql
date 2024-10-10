/*
  Warnings:

  - You are about to drop the `Projects` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProjectsImages` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ProjectsToTag` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Projects" DROP CONSTRAINT "Projects_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "Projects" DROP CONSTRAINT "Projects_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectsImages" DROP CONSTRAINT "ProjectsImages_blueprintId_fkey";

-- DropForeignKey
ALTER TABLE "_ProjectsToTag" DROP CONSTRAINT "_ProjectsToTag_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProjectsToTag" DROP CONSTRAINT "_ProjectsToTag_B_fkey";

-- DropTable
DROP TABLE "Projects";

-- DropTable
DROP TABLE "ProjectsImages";

-- DropTable
DROP TABLE "_ProjectsToTag";

-- CreateTable
CREATE TABLE "Project" (
    "id" SERIAL NOT NULL,
    "type" "ProjectType" NOT NULL DEFAULT 'BLUEPRINT',
    "visibility" "ProjectVisibility" NOT NULL DEFAULT 'PUBLIC',
    "status" "ProjectStatus" DEFAULT 'DRAFT',
    "icon" TEXT DEFAULT 'default.webp',
    "bannerId" INTEGER,
    "description" TEXT DEFAULT 'Please add a description',
    "categoryId" INTEGER,
    "fileUrl" TEXT DEFAULT '',
    "ownerId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectImage" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT DEFAULT '',
    "url" TEXT NOT NULL,
    "blueprintId" INTEGER NOT NULL,

    CONSTRAINT "ProjectImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ProjectToTag" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Project_bannerId_key" ON "Project"("bannerId");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectImage_blueprintId_key" ON "ProjectImage"("blueprintId");

-- CreateIndex
CREATE UNIQUE INDEX "_ProjectToTag_AB_unique" ON "_ProjectToTag"("A", "B");

-- CreateIndex
CREATE INDEX "_ProjectToTag_B_index" ON "_ProjectToTag"("B");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_bannerId_fkey" FOREIGN KEY ("bannerId") REFERENCES "ProjectImage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectImage" ADD CONSTRAINT "ProjectImage_blueprintId_fkey" FOREIGN KEY ("blueprintId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectToTag" ADD CONSTRAINT "_ProjectToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectToTag" ADD CONSTRAINT "_ProjectToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
