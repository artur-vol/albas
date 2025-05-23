import mongoose from 'mongoose';

const borrowingSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  book_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
  borrow_date: Date,
  due_date: Date,
  return_date: Date,
  fine: Number
});

export default mongoose.model('BookBorrowing', borrowingSchema);
