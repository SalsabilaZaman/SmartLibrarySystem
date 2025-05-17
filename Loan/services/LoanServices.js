const LoanRepository = require('../repositories/LoanRepository');
const axios = require('axios');
const HttpClient = require('./HttpClient');

const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://user-service:8081';
const BOOK_SERVICE_URL = process.env.BOOK_SERVICE_URL || 'http://book-service:8082';

const userService = new HttpClient(USER_SERVICE_URL);
const bookService = new HttpClient(BOOK_SERVICE_URL);


const Sequelize = require('sequelize');
const Loan = require('../models/Loan');


class LoanService {
  async issueBook(user_id, book_id, due_date) {
    const userResponse = await userService.get(`/api/users/${user_id}`);
      if (!userResponse.data) {
        throw new Error('User not found');
      }

      // Validate Book Availability
      const bookResponse = await bookService.get(`/api/books/${book_id}`);
      const book = bookResponse.data;

      if (!book || book.available_copies <= 0) {
        throw new Error('Book not available');
      }

      await bookService.patch(`/api/books/${book_id}/availability`, {
          available_copies: 1,
          "operation": "decrement"

      });
    const loanData = {
      user_id,
      book_id,
      due_date,
      issue_date: new Date(),
      status: 'ACTIVE',
    };
    return await LoanRepository.createLoan(loanData);
  }

  async returnBook(loan_id) {
    try {
      const loan = await LoanRepository.getLoanById(loan_id);
      if (!loan) throw new Error('Loan not found');

      const { book_id } = loan;

      // Update Loan
      const updatedLoan = await LoanRepository.updateLoan(loan_id, {
        return_date: new Date(),
        status: 'RETURNED',
      });

      await bookService.patch(`/api/books/${book_id}/availability`, {
          available_copies: 1,
          "operation": "increment"
      });

      return updatedLoan;

    } catch (error) {
      throw new Error(`Failed to return book: ${error.message}`);
    }
  }


  // async getUserLoans(userId) {
  //   return await LoanRepository.getUserLoans(userId);
  // }

  async getUserLoans(user_id) {
    try {
      const loans = await LoanRepository.getUserLoans(user_id);

      const loansWithDetails = await Promise.all(
        loans.map(async (loan) => {
          try {
            const bookResponse = await bookService.get(`/api/books/${loan.book_id}`);
            return { loan, book: bookResponse.data };
          } catch (err) {
            return { ...loan, book: null }; 
          }
        })
      );

      return loansWithDetails;

    } catch (error) {
      throw new Error(`Failed to fetch user loans: ${error.message}`);
    }
  }

  // async getLoanDetails(loanId) {
  //   return await LoanRepository.getLoanById(loanId);
  // }

  async getLoanDetails(loan_id) {
    try {
      const loan = await LoanRepository.getLoanById(loan_id);
      if (!loan) throw new Error('Loan not found');

      const [userResponse, bookResponse] = await Promise.all([
        userService.get(`/api/users/${loan.user_id}`),
        bookService.get(`/api/books/${loan.book_id}`)
      ]);

      return {
        loan,
        user: userResponse.data,
        book: bookResponse.data,
      };

    } catch (error) {
      throw new Error(`Failed to fetch loan details: ${error.message}`);
    }
  }
  

  // async getOverdueLoans() {
  //   const now = new Date();
  //   const overdueLoans = await Loan.findAll({
  //     where: {
  //       status: 'ACTIVE',
  //       due_date: { [Sequelize.Op.lt]: now }
  //     },
  //     include: [
  //       {
  //         model: require('../models/Book'),
  //         as: 'book',
  //         attributes: ['id', 'title', 'author']
  //       }
  //     ]
  //   });

  //   return overdueLoans.map(loan => ({
  //     id: loan.id,
  //     book: loan.book,
  //     issue_date: loan.issue_date,
  //     due_date: loan.due_date,
  //     return_date: loan.return_date,
  //     status: loan.status
  //   }));
  // }

  // async extendLoan(id, extensionDays) {
  //   const loan = await LoanRepository.getLoanById(id);
  //   if (!loan) throw new Error('Loan not found');
  //   if (loan.status !== 'ACTIVE') throw new Error('Only active loans can be extended');

  //   loan.due_date = new Date(new Date(loan.due_date).setDate(new Date(loan.due_date).getDate() + extensionDays));
  //   loan.extensions_count += 1;
  //   await loan.save();

  //   return loan;
  // }
}

module.exports = new LoanService();