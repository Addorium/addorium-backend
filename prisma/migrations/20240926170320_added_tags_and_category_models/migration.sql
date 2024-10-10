/*
  Warnings:

  - You are about to drop the column `category` on the `Projects` table. All the data in the column will be lost.
  - You are about to drop the column `tags` on the `Projects` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Projects" DROP COLUMN "category",
DROP COLUMN "tags",
ADD COLUMN     "categoryId" INTEGER;

-- CreateTable
CREATE TABLE "Tag" (
    "id" SERIAL NOT NULL,
    "icon" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "projectType" "ProjectType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "icon" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "projectType" "ProjectType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ProjectsToTag" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_ProjectsToTag_AB_unique" ON "_ProjectsToTag"("A", "B");

-- CreateIndex
CREATE INDEX "_ProjectsToTag_B_index" ON "_ProjectsToTag"("B");

-- AddForeignKey
ALTER TABLE "Projects" ADD CONSTRAINT "Projects_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectsToTag" ADD CONSTRAINT "_ProjectsToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectsToTag" ADD CONSTRAINT "_ProjectsToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
