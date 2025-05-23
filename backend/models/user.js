import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  full_name: String,
  email: String,
  password_hash: String,
  role: String,
  phone: String,
  blocked: Boolean
});

export default mongoose.model('User', userSchema);
