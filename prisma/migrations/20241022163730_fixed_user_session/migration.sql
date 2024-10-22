-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "downloads" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "UserSession" ADD COLUMN     "city" TEXT DEFAULT '',
ADD COLUMN     "country" TEXT DEFAULT '',
ADD COLUMN     "os" TEXT DEFAULT '',
ADD COLUMN     "platform" TEXT DEFAULT '',
ALTER COLUMN "userAgent" DROP NOT NULL,
ALTER COLUMN "userAgent" SET DEFAULT '',
ALTER COLUMN "ip" DROP NOT NULL,
ALTER COLUMN "ip" SET DEFAULT '';

-- CreateTable
CREATE TABLE "_ProjectFollowers" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ProjectFollowers_AB_unique" ON "_ProjectFollowers"("A", "B");

-- CreateIndex
CREATE INDEX "_ProjectFollowers_B_index" ON "_ProjectFollowers"("B");

-- AddForeignKey
ALTER TABLE "_ProjectFollowers" ADD CONSTRAINT "_ProjectFollowers_A_fkey" FOREIGN KEY ("A") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectFollowers" ADD CONSTRAINT "_ProjectFollowers_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
