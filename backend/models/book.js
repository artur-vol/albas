import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  title: String,
  isbn: String,
  author_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Author' },
  genre_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Genre' },
  publisher_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Publisher' },
  year: Number,
  copies_total: Number,
  copies_available: Number,
  description: String
});

export default mongoose.model('Book', bookSchema);
