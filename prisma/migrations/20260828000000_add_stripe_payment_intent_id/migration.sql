-- AlterTable
ALTER TABLE "Order" ADD COLUMN "stripePaymentIntentId" VARCHAR(255);

-- CreateIndex
CREATE UNIQUE INDEX "Order_stripePaymentIntentId_key" ON "Order"("stripePaymentIntentId");