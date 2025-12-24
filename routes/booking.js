import express from 'express';
import Booking from '../models/Booking.js';
import Hotel from '../models/Hotel.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Create booking (user only)
router.post('/', auth('user'), async (req, res) => {
  try {
    const { hotel, checkInDate, checkOutDate } = req.body;

    if (!hotel || !checkInDate || !checkOutDate) {
      return res.status(400).json({ error: 'All fields required' });
    }

    // Verify hotel exists
    const hotelExists = await Hotel.findById(hotel);
    if (!hotelExists) {
      return res.status(404).json({ error: 'Hotel not found' });
    }

    // Check if check-out date is after check-in date
    if (new Date(checkOutDate) <= new Date(checkInDate)) {
      return res.status(400).json({ error: 'Check-out date must be after check-in date' });
    }

    const booking = await Booking.create({
      user: req.user.id,
      hotel,
      checkInDate,
      checkOutDate
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate('hotel')
      .populate('user', 'name email');

    res.status(201).json(populatedBooking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Get bookings based on role
router.get('/', auth(), async (req, res) => {
  try {
    let bookings;
    if (req.user.role === 'user') {
      // Users see only their bookings
      bookings = await Booking.find({ user: req.user.id })
        .populate('hotel')
        .populate('user', 'name email');
    } else if (req.user.role === 'owner') {
      // Owners see bookings for their hotels
      const ownerHotels = await Hotel.find({ owner: req.user.id }).select('_id');
      const hotelIds = ownerHotels.map(h => h._id);
      
      bookings = await Booking.find({ hotel: { $in: hotelIds } })
        .populate('hotel')
        .populate('user', 'name email');
    } else {
      // Admin sees all bookings
      bookings = await Booking.find()
        .populate('hotel')
        .populate('user', 'name email');
    }
    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Get booking by ID
router.get('/:id', auth(), async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('hotel')
      .populate('user', 'name email');

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Check authorization
    if (req.user.role === 'user') {
      // Users can only see their own bookings
      if (booking.user._id.toString() !== req.user.id) {
        return res.status(403).json({ error: 'Forbidden' });
      }
    } else if (req.user.role === 'owner') {
      // Owners can see bookings for their hotels
      const hotel = await Hotel.findById(booking.hotel._id);
      if (hotel.owner.toString() !== req.user.id) {
        return res.status(403).json({ error: 'Forbidden' });
      }
    }

    res.json(booking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Update booking (user only - their own booking)
router.put('/:id', auth('user'), async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // User can only update their own booking
    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const { checkInDate, checkOutDate } = req.body;

    // Check if check-out date is after check-in date
    if (checkOutDate && checkInDate && new Date(checkOutDate) <= new Date(checkInDate)) {
      return res.status(400).json({ error: 'Check-out date must be after check-in date' });
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      { checkInDate, checkOutDate },
      { new: true, runValidators: true }
    )
      .populate('hotel')
      .populate('user', 'name email');

    res.json(updatedBooking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Delete booking (user only - their own booking)
router.delete('/:id', auth('user'), async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // User can only delete their own booking
    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: 'Booking deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;

