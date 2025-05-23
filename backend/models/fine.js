import mongoose from 'mongoose';

const fineSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  reason: { type: String, required: true },
  paid: { type: Boolean, default: false }
});

export default mongoose.model('Fine', fineSchema);

