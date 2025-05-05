-- AlterEnum
ALTER TYPE "ScanStatus" ADD VALUE 'idle';

-- AlterTable
ALTER TABLE "Device" ALTER COLUMN "scan_status" SET DEFAULT 'idle';
