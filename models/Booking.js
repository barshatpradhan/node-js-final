import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  hotel: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true },
  checkInDate: { type: Date, required: true },
  checkOutDate: { type: Date, required: true }
}, { timestamps: true });

export default mongoose.model('Booking', BookingSchema);