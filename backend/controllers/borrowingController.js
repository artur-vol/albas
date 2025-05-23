import Book from '../models/book.js';
import BookBorrowing from '../models/bookBorrowing.js';
import BookBooking from '../models/bookBooking.js';
import Fine from '../models/fine.js';

export async function borrowBook(req, res) {
  try {
    const { book_id } = req.body;
    const user_id = req.user.userId;

    const book = await Book.findById(book_id);
    if (!book) return res.status(404).json({ message: 'Книгу не знайдено' });

    if (book.copies_available < 1) {
      return res.status(400).json({ message: 'Немає доступних примірників' });
    }

    const duplicate = await BookBorrowing.findOne({ user_id, book_id, return_date: null });
    if (duplicate) {
      return res.status(400).json({ message: 'Ця книга вже видана вам і не повернена' });
    }

    const activeCount = await BookBorrowing.countDocuments({ user_id, return_date: null });
    if (activeCount >= 3) {
      return res.status(400).json({ message: 'Перевищено ліміт активних видач (максимум 3 книги)' });
    }

    const borrowDate = new Date();
    const dueDate = new Date(borrowDate);
    dueDate.setDate(dueDate.getDate() + 14);

    const borrowing = await BookBorrowing.create({ user_id, book_id, borrow_date: borrowDate, due_date, return_date: null, fine: 0 });

    book.copies_available -= 1;
    await book.save();

    await BookBooking.updateOne({ user_id, book_id, active: true }, { $set: { active: false } });

    res.status(201).json({ message: 'Книгу видано', borrowing });
  } catch (err) {
    res.status(500).json({ message: 'Помилка видачі', error: err.message });
  }
}

export async function returnBook(req, res) {
  try {
    const { book_id } = req.body;
    const user_id = req.user.userId;

    const borrowing = await BookBorrowing.findOne({ user_id, book_id, return_date: null });
    if (!borrowing) return res.status(404).json({ message: 'Активну видачу не знайдено' });

    const now = new Date();
    borrowing.return_date = now;

    const overdueMs = now - borrowing.due_date;
    const overdueDays = Math.max(0, Math.floor(overdueMs / (1000 * 60 * 60 * 24)));
    let fineAmount = 0;

    const book = await Book.findById(book_id);

    if (overdueDays > 0) {
      fineAmount = overdueDays * 10;
      borrowing.fine = fineAmount;
      await Fine.create({ user_id, amount: fineAmount, reason: `Прострочення повернення книги "${book.title}"`, paid: false });
    }

    await borrowing.save();
    await Book.findByIdAndUpdate(book_id, { $inc: { copies_available: 1 } });

    res.json({ message: 'Книгу повернено', fine: fineAmount });
  } catch (err) {
    res.status(500).json({ message: 'Помилка повернення', error: err.message });
  }
}

export async function adminReturnBook(req, res) {
  try {
    const { book_id, user_id } = req.body;
    if (!book_id || !user_id) {
      return res.status(400).json({ message: 'Необхідні поля: book_id та user_id' });
    }

    const borrowing = await BookBorrowing.findOne({ user_id, book_id, return_date: null });
    if (!borrowing) return res.status(404).json({ message: 'Активну видачу не знайдено' });

    const now = new Date();
    borrowing.return_date = now;

    const overdueMs = now - borrowing.due_date;
    const overdueDays = Math.max(0, Math.floor(overdueMs / (1000 * 60 * 60 * 24)));
    let fineAmount = 0;

    const book = await Book.findById(book_id);

    if (overdueDays > 0) {
      fineAmount = overdueDays * 10;
      borrowing.fine = fineAmount;
      await Fine.create({ user_id, amount: fineAmount, reason: `Прострочення повернення книги "${book.title}"`, paid: false });
    }

    await borrowing.save();
    await Book.findByIdAndUpdate(book_id, { $inc: { copies_available: 1 } });

    res.json({ message: 'Книгу повернено адміністратором', fine: fineAmount });
  } catch (err) {
    res.status(500).json({ message: 'Помилка повернення (admin)', error: err.message });
  }
}

export async function adminBorrowBook(req, res) {
  try {
    const { book_id, user_id } = req.body;
    if (!book_id || !user_id) return res.status(400).json({ message: 'Необхідно вказати і book_id, і user_id' });

    const book = await Book.findById(book_id);
    if (!book) return res.status(404).json({ message: 'Книгу не знайдено' });

    if (book.copies_available < 1) {
      return res.status(400).json({ message: 'Немає доступних примірників' });
    }

    const duplicate = await BookBorrowing.findOne({ user_id, book_id, return_date: null });
    if (duplicate) {
      return res.status(400).json({ message: 'Користувач вже має цю книгу на руках' });
    }

    const activeCount = await BookBorrowing.countDocuments({ user_id, return_date: null });
    if (activeCount >= 3) {
      return res.status(400).json({ message: 'Користувач перевищив ліміт активних видач (максимум 3)' });
    }

    const borrowDate = new Date();
    const dueDate = new Date(borrowDate);
    dueDate.setDate(dueDate.getDate() + 14);

    const borrowing = await BookBorrowing.create({
      user_id,
      book_id,
      borrow_date: borrowDate,
      due_date,
      return_date: null,
      fine: 0
    });

    book.copies_available -= 1;
    await book.save();

    await BookBooking.updateOne({ user_id, book_id, active: true }, { $set: { active: false } });

    res.status(201).json({ message: 'Книгу успішно видано адміністратором', borrowing });
  } catch (err) {
    res.status(500).json({ message: 'Помилка видачі адміністратором', error: err.message });
  }
}

export async function getAllBorrowings(req, res) {
  try {
    const borrowings = await BookBorrowing.find()
      .populate('user_id', 'full_name email')
      .populate('book_id', 'title')
      .sort({ borrow_date: -1 });

    res.json(borrowings);
  } catch (err) {
    res.status(500).json({ message: 'Помилка при отриманні списку видач', error: err.message });
  }
}

