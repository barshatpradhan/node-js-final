import mongoose from 'mongoose';

const OwnerSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: 'owner' },
  hotels: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Hotel' }]
});

export default mongoose.model('Owner', OwnerSchema);
