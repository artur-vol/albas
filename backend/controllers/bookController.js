import Book from '../models/book.js';
import Author from '../models/author.js';

export async function getAllBooks(req, res) {
  try {
    const {
      title,
      author,
      genre,
      year_from,
      year_to,
      available
    } = req.query;

    let query = {};

    if (title) query.title = { $regex: title, $options: 'i' };
    if (genre) query.genre_id = genre;
    if (year_from || year_to) {
      query.year = {};
      if (year_from) query.year.$gte = Number(year_from);
      if (year_to) query.year.$lte = Number(year_to);
    }
    if (available === 'true') query.copies_available = { $gt: 0 };

    if (author) {
      if (author.match(/^[0-9a-fA-F]{24}$/)) {
        query.author_id = author;
      } else {
        const authors = await Author.find({ name: { $regex: author, $options: 'i' } }, '_id');
        if (authors.length === 0) return res.json([]);
        query.author_id = { $in: authors.map(a => a._id) };
      }
    }

    const books = await Book.find(query)
      .populate('author_id')
      .populate('genre_id')
      .populate('publisher_id');

    res.json(books);
  } catch (err) {
    res.status(400).json({ message: 'Помилка фільтрації', error: err.message });
  }
}

export async function getBookById(req, res) {
  try {
    const book = await Book.findById(req.params.id)
      .populate('author_id')
      .populate('genre_id')
      .populate('publisher_id');

    if (!book) return res.status(404).json({ message: 'Книгу не знайдено' });

    res.json(book);
  } catch {
    res.status(400).json({ message: 'Некоректний ID книги' });
  }
}

export async function createBook(req, res) {
  try {
    const { title, isbn, author_id, genre_id, publisher_id, year, copies_total, description } = req.body;

    const book = await Book.create({
      title,
      isbn,
      author_id,
      genre_id,
      publisher_id,
      year,
      copies_total,
      copies_available: copies_total,
      description
    });

    res.status(201).json(book);
  } catch (err) {
    res.status(400).json({ message: 'Помилка при додаванні книги', error: err.message });
  }
}

export async function updateBook(req, res) {
  try {
    const updated = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!updated) return res.status(404).json({ message: 'Книгу не знайдено' });

    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: 'Помилка при оновленні книги', error: err.message });
  }
}

export async function deleteBook(req, res) {
  try {
    const deleted = await Book.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Книгу не знайдено' });

    res.json({ message: 'Книгу видалено' });
  } catch (err) {
    res.status(400).json({ message: 'Помилка при видаленні книги', error: err.message });
  }
}

