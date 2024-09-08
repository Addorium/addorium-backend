-- AlterTable
ALTER TABLE "Blueprints" ALTER COLUMN "icon" SET DEFAULT 'default.webp',
ALTER COLUMN "banner" SET DEFAULT 'default.webp';

-- AlterTable
ALTER TABLE "Scripts" ALTER COLUMN "icon" SET DEFAULT 'default.webp',
ALTER COLUMN "banner" SET DEFAULT 'default.webp';

-- AlterTable
ALTER TABLE "Themes" ALTER COLUMN "icon" SET DEFAULT 'default.webp',
ALTER COLUMN "banner" SET DEFAULT 'default.webp';

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "avatar" SET DEFAULT 'default.webp';

-- AlterTable
ALTER TABLE "UserSession" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
