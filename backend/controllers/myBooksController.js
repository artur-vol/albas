import BookBorrowing from '../models/bookBorrowing.js';
import BookBooking from '../models/bookBooking.js';

export async function getMyBooks(req, res) {
  const user_id = req.user.userId;

  try {
    const borrowings_active = await BookBorrowing.find({
      user_id,
      return_date: null
    }).populate({
      path: 'book_id',
      populate: [{ path: 'author_id' }, { path: 'genre_id' }]
    });

    const borrowings_returned = await BookBorrowing.find({
      user_id,
      return_date: { $ne: null }
    }).populate({
      path: 'book_id',
      populate: [{ path: 'author_id' }, { path: 'genre_id' }]
    });

    const bookings = await BookBooking.find({
      user_id,
      active: true
    }).populate({
      path: 'book_id',
      populate: [{ path: 'author_id' }, { path: 'genre_id' }]
    });

    res.json({
      borrowings_active,
      borrowings_returned,
      bookings
    });
  } catch (err) {
    res.status(500).json({ message: 'Помилка отримання книг', error: err.message });
  }
}

