-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Dairy" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL
);
INSERT INTO "new_Dairy" ("content", "date", "id", "title") SELECT "content", "date", "id", "title" FROM "Dairy";
DROP TABLE "Dairy";
ALTER TABLE "new_Dairy" RENAME TO "Dairy";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
