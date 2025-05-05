-- CreateEnum
CREATE TYPE "ScanStatus" AS ENUM ('requested', 'running', 'completed');

-- AlterTable
ALTER TABLE "Device" ADD COLUMN     "scan_status" "ScanStatus" NOT NULL DEFAULT 'requested';
