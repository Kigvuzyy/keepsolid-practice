-- DropForeignKey
ALTER TABLE "BooksOnAuthors" DROP CONSTRAINT "BooksOnAuthors_bookId_fkey";

-- DropForeignKey
ALTER TABLE "BooksOnGenres" DROP CONSTRAINT "BooksOnGenres_bookId_fkey";

-- AddForeignKey
ALTER TABLE "BooksOnGenres" ADD CONSTRAINT "BooksOnGenres_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BooksOnAuthors" ADD CONSTRAINT "BooksOnAuthors_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;
