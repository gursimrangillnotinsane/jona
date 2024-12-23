-- CreateTable
CREATE TABLE "Dairy" (
    "id" SERIAL NOT NULL,
    "date" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "Dairy_pkey" PRIMARY KEY ("id")
);
