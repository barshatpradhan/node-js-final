// import express from 'express';
// import Booking from '../models/Booking.js';
// import auth from '../middleware/auth.js';

// const router = express.Router();

// // CREATE booking
// router.post('/', auth('user'), async (req, res) => {
//   const booking = await Booking.create({ ...req.body, user: req.user.id });
//   res.status(201).json(booking);
// });

// // GET all bookings for logged-in user
// router.get('/', auth('user'), async (req, res) => {
//   const bookings = await Booking.find({ user: req.user.id }).populate('hotel');
//   res.json(bookings);
// });

// // GET booking by ID
// router.get('/:id', auth('user'), async (req, res) => {
//   const booking = await Booking.findById(req.params.id).populate('hotel');
//   if (!booking) return res.status(404).json({ error: 'Booking not found' });
//   if (booking.user.toString() !== req.user.id) return res.status(403).json({ error: 'Forbidden' });
//   res.json(booking);
// });

// export default router;


import express from 'express';
import Booking from '../models/Booking.js';
import auth from '../middleware/auth.js';

const router = express.Router();


router.post('/', auth('user'), async (req, res) => {
  try {
    const booking = await Booking.create({
      ...req.body,
      user: req.user.id, // user ID from JWT
    });
    res.status(201).json(booking);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


router.get('/', auth(), async (req, res) => {
  try {
    let bookings;
    if (req.user.role === 'user') {
      bookings = await Booking.find({ user: req.user.id }).populate('hotel').populate('user', 'name email');
    } else {
      // For admin or other roles
      bookings = await Booking.find().populate('hotel').populate('user', 'name email');
    }
    res.json(bookings);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


router.get('/:id', auth('user'), async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('hotel')
      .populate('user', 'name email');

    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    // Ensure user owns this booking
    if (booking.user._id.toString() !== req.user.id)
      return res.status(403).json({ error: 'Forbidden' });

    res.json(booking);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
