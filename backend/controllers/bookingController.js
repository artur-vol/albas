import BookBooking from '../models/bookBooking.js';
import Book from '../models/book.js';

export async function getAllBookings(req, res) {
  try {
    const now = new Date();

    await BookBooking.updateMany(
      { active: true, expires_at: { $lt: now } },
      { $set: { active: false } }
    );

    const bookings = await BookBooking.find()
      .populate('user_id', 'full_name email')
      .populate('book_id', 'title')
      .sort({ booking_date: -1 });

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Помилка отримання всіх бронювань', error: err.message });
  }
}

export async function createBooking(req, res) {
  try {
    const { book_id } = req.body;
    const user_id = req.user.userId;

    const book = await Book.findById(book_id);
    if (!book) return res.status(404).json({ message: 'Книгу не знайдено' });

    const existing = await BookBooking.findOne({
      user_id,
      book_id,
      active: true
    });

    if (existing) {
      return res.status(400).json({ message: 'У вас уже є активна бронь на цю книгу' });
    }

    const bookingDate = new Date();
    const expiresAt = new Date(bookingDate);
    expiresAt.setDate(expiresAt.getDate() + 3);

    const booking = await BookBooking.create({
      user_id,
      book_id,
      booking_date: bookingDate,
      expires_at: expiresAt,
      active: true
    });

    res.status(201).json({ message: 'Бронювання створено', booking });
  } catch (err) {
    res.status(500).json({ message: 'Помилка бронювання', error: err.message });
  }
}

export async function getUserBookings(req, res) {
  const requester = req.user;
  const { userId } = req.params;

  if (requester.userId !== userId && requester.role !== 'admin') {
    return res.status(403).json({ message: 'Доступ заборонено' });
  }

  try {
    const now = new Date();

    await BookBooking.updateMany(
      { user_id: userId, active: true, expires_at: { $lt: now } },
      { $set: { active: false } }
    );

    const bookings = await BookBooking.find({ user_id: userId })
      .populate('book_id');

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Помилка отримання бронювань', error: err.message });
  }
}

export async function cancelBooking(req, res) {
  try {
    const booking = await BookBooking.findById(req.params.id).populate('book_id');
    if (!booking) {
      return res.status(404).json({ message: 'Бронювання не знайдено' });
    }

    const requester = req.user;

    if (
      requester.userId !== booking.user_id.toString() &&
      requester.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Доступ заборонено' });
    }

    if (!booking.active) {
      return res.status(400).json({ message: 'Це бронювання вже неактивне' });
    }

    booking.active = false;
    await booking.save();

    res.json({ message: 'Бронювання скасовано' });
  } catch (err) {
    res.status(500).json({ message: 'Помилка ануляції бронювання', error: err.message });
  }
}

