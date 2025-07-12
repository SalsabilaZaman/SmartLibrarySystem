const bookRepository = require('../repositories/BookRepository');

const addBook = async (bookData) => {
  return await bookRepository.addBook(bookData);
};

const getBook = async (bookID) => {
    const book = await bookRepository.getBookById(bookID);
    if (!book) {
      throw new Error('Book not found');
    }
    return book;
};

const updateBook = async (bookID,bookData) => {
    const book = await bookRepository.updateBook(bookID,bookData);
    if (!book) {
      throw new Error('Book not found');
    }
    return book;
  };

const deleteBook = async (bookID) => {
    const book = await bookRepository.deleteBook(bookID);
    if (!book) {
      throw new Error('Book not found');
    }
    return book;
  };  

const searchBooks = async (searchTerm) => {
  return await bookRepository.searchBooks(searchTerm);
};

const updateAvailability = async (id, available_copies, operation) => {
  const book = await bookRepository.getBookById(id);

  if (!book) {
    throw new Error('Book not found');
  }

  const adjustment = operation === 'increment' ? available_copies : -available_copies;
  const newAvailableCopies = book.available_copies + adjustment;

  if (newAvailableCopies < 0) {
    throw new Error('Available copies cannot be less than zero');
  }

  return await bookRepository.updateAvailability(id, newAvailableCopies);
};

module.exports = {
  addBook,
  getBook,
  updateBook,
  deleteBook,
  searchBooks,updateAvailability
};
