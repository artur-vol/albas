import mongoose from 'mongoose';

const authorSchema = new mongoose.Schema({
  name: String,
  birth_year: Number,
  death_year: Number,
  biography: String
});

export default mongoose.model('Author', authorSchema);
