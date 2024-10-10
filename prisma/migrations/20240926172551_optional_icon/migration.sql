-- AlterTable
ALTER TABLE "Category" ALTER COLUMN "icon" DROP NOT NULL,
ALTER COLUMN "icon" SET DEFAULT 'default.svg';

-- AlterTable
ALTER TABLE "Tag" ALTER COLUMN "icon" DROP NOT NULL,
ALTER COLUMN "icon" SET DEFAULT 'default.svg';
