/*
  Warnings:

  - A unique constraint covering the columns `[portalId]` on the table `RefreshToken` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_portalId_key" ON "RefreshToken"("portalId");
