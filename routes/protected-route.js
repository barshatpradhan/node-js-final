import express from 'express';
import Booking from '../models/Booking.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Create booking (user only)
router.post('/', auth('user'), async (req, res) => {
  try {
    const booking = await Booking.create({
      ...req.body,
      user: req.user.id
    });
    res.status(201).json(booking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Get user's bookings
router.get('/', auth('user'), async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('hotel')
      .populate('user', 'name email');
    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Get booking by ID (user only)
router.get('/:id', auth('user'), async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('hotel')
      .populate('user', 'name email');

    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    if (booking.user._id.toString() !== req.user.id)
      return res.status(403).json({ error: 'Forbidden' });

    res.json(booking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
