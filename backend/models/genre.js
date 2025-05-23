import mongoose from 'mongoose';

const genreSchema = new mongoose.Schema({
  name: String,
  description: String
});

export default mongoose.model('Genre', genreSchema);
