/*
  Warnings:

  - You are about to drop the column `blueprintId` on the `ProjectImage` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[projectId]` on the table `ProjectImage` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `projectId` to the `ProjectImage` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ProjectImage" DROP CONSTRAINT "ProjectImage_blueprintId_fkey";

-- DropIndex
DROP INDEX "ProjectImage_blueprintId_key";

-- AlterTable
ALTER TABLE "ProjectImage" DROP COLUMN "blueprintId",
ADD COLUMN     "projectId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ProjectImage_projectId_key" ON "ProjectImage"("projectId");

-- AddForeignKey
ALTER TABLE "ProjectImage" ADD CONSTRAINT "ProjectImage_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
