import mongoose from 'mongoose';

const publisherSchema = new mongoose.Schema({
  name: String,
  city: String,
  founded_year: Number
});

export default mongoose.model('Publisher', publisherSchema);
