/*
  Warnings:

  - Added the required column `new` to the `Purchases` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Purchases" ADD COLUMN     "new" TEXT NOT NULL;
