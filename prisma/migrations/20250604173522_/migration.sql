/*
  Warnings:

  - You are about to drop the column `userId` on the `Bet` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `CardAssociation` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Hand` table. All the data in the column will be lost.
  - You are about to drop the column `winnerId` on the `Trick` table. All the data in the column will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `User` table. All the data in the column will be lost.
  - Added the required column `userName` to the `Bet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userName` to the `Hand` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Bet" DROP CONSTRAINT "Bet_userId_fkey";

-- DropForeignKey
ALTER TABLE "CardAssociation" DROP CONSTRAINT "CardAssociation_userId_fkey";

-- DropForeignKey
ALTER TABLE "Hand" DROP CONSTRAINT "Hand_userId_fkey";

-- DropForeignKey
ALTER TABLE "Trick" DROP CONSTRAINT "Trick_winnerId_fkey";

-- AlterTable
ALTER TABLE "Bet" DROP COLUMN "userId",
ADD COLUMN     "userName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "CardAssociation" DROP COLUMN "userId",
ADD COLUMN     "userName" TEXT;

-- AlterTable
ALTER TABLE "Hand" DROP COLUMN "userId",
ADD COLUMN     "userName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Trick" DROP COLUMN "winnerId",
ADD COLUMN     "winnerName" TEXT;

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("name");

-- AddForeignKey
ALTER TABLE "Hand" ADD CONSTRAINT "Hand_userName_fkey" FOREIGN KEY ("userName") REFERENCES "User"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bet" ADD CONSTRAINT "Bet_userName_fkey" FOREIGN KEY ("userName") REFERENCES "User"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardAssociation" ADD CONSTRAINT "CardAssociation_userName_fkey" FOREIGN KEY ("userName") REFERENCES "User"("name") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trick" ADD CONSTRAINT "Trick_winnerName_fkey" FOREIGN KEY ("winnerName") REFERENCES "User"("name") ON DELETE SET NULL ON UPDATE CASCADE;
