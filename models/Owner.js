import mongoose from 'mongoose';

const OwnerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'owner' },
  hotels: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Hotel' }]
}, { timestamps: true });

export default mongoose.model('Owner', OwnerSchema);