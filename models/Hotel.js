import mongoose from 'mongoose';

const HotelSchema = new mongoose.Schema({
  name: String,
  location: String,
  pricePerNight: Number,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'Owner' }
});

export default mongoose.model('Hotel', HotelSchema);
