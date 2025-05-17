const bookService = require('../services/BookServices');

exports.addBook = async (req, res) => {
  try {
    const book = await bookService.addBook(req.body);
    res.status(201).json(book);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.fetchBook = async (req, res) => {
  try {
    const book = await bookService.getBook(req.params.id);
    res.json(book);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

exports.updateBook = async (req, res) => {
    try {
      const book = await bookService.updateBook(req.params.id,req.body);
      res.json(book);
    } catch (err) {
      res.status(404).json({ error: err.message });
    }
  };
  

exports.deleteBook = async (req, res) => {
  try {
    const deletedBook = await bookService.deleteBook(req.params.id);
    res.json(deletedBook);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


exports.searchBooks = async (req, res) => {
  try {
    const books = await bookService.searchBooks(req.query.search);
    res.json(books);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const { available_copies, operation } = req.body;

    if (!['increment', 'decrement'].includes(operation)) {
      return res.status(400).json({ error: 'Invalid operation. Use increment or decrement.' });
    }

    const updatedBook = await bookService.updateAvailability(id, available_copies, operation);
    res.json(updatedBook);
  } catch (error) {
    console.error('Error in updateAvailability:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};