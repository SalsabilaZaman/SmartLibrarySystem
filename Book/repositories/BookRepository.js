const Book = require('../models/Book');
const { Op } = require('sequelize');


const addBook = async (bookData) => {
    try {
        const { title, author, isbn, copies } = bookData;
    
        if (!title || !author || !isbn || !copies) {
          throw new Error('All fields (title, author, isbn, copies) are required.');
        }
    
        const newBook = await Book.create({
          title,
          author,
          isbn,
          copies,
          available_copies: copies, // Initially, all copies are available
        });

      return newBook;
    } catch (error) {
      console.error('Error adding new book:', error.message);
      throw error;
    }
  };
  

const getBookById = async (bookID) => {
  const bookid=bookID;
  return await Book.findByPk(bookid);
};

const updateBook = async (bookID,bookData ) => {
    try {
        const{copies,available_copies}=bookData;
        
        console.error("this is book id-"+bookID);
        
        const book = await Book.findByPk(bookID);
    
        if (!book) throw new Error('Book not found');
        book.copies=copies;
        book.available_copies=available_copies;
        await book.save();
    
        return book;
      } catch (error) {
        console.error('Error updating copies:', error.message);
        throw error;
      }
  };

const borrowBook = async (bookId) => {
  try {
    const book = await Book.findByPk(bookId);

    if (!book) throw new Error('Book not found');
    if (book.available_copies <= 0) throw new Error('No copies available');

    book.available_copies -= 1;
    await book.save();

    return book;
  } catch (error) {
    console.error('Error borrowing book:', error.message);
    throw error;
  }
};

const deleteBook = async (bookId) => {
    try {
      const book = await Book.findByPk(bookId);
  
      if (!book) {
        throw new Error('Book not found');
      }
  
      await book.destroy();
      console.log(`Book with ID ${bookId} has been deleted.`);
      return { message: 'Book deleted successfully' };
      
    } catch (error) {
      console.error('Error deleting book:', error.message);
      throw error;
    }
  };
  
const findAll=async() => {
    return await Book.findAll();
  };
const count = async () => {
    return await Book.count();
  };

const searchBooks = async (searchTerm) => {
  return await Book.findAll({
    where: {
      [Op.or]: [
        { title: { [Op.iLike]: `%${searchTerm}%` } },
        { author: { [Op.iLike]: `%${searchTerm}%` } }
      ]
    }
  });
};

const updateAvailability = async (id, available_copies) => {
  const book = await Book.findByPk(id);

  if (!book) {
    throw new Error('Book not found');
  }

  book.available_copies = available_copies;
  await book.save();

  return {
    id: book.id,
    available_copies: book.available_copies,
    updated_at: book.updatedAt
  };
};

  
module.exports = {
  addBook,
  getBookById,
  updateBook,
  deleteBook,borrowBook,findAll,count,searchBooks,updateAvailability
};
