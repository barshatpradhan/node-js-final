import mongoose from 'mongoose';

const HotelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  pricePerNight: { type: Number, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'Owner', required: true }
}, { timestamps: true });

export default mongoose.model('Hotel', HotelSchema);