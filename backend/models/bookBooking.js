import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  book_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  booking_date: { type: Date, default: Date.now },
  expires_at: { type: Date, required: true },
  active: { type: Boolean, default: true }
});

export default mongoose.model('BookBooking', bookingSchema);
