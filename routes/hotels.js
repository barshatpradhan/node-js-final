


// import express from 'express';
// import Hotel from '../models/Hotel.js';
// import auth from '../middleware/auth.js';

// const router = express.Router();

// /* ======================
//    GET ALL HOTELS (Public)
// ====================== */
// router.get('/', async (req, res) => {
//   try {
//     const hotels = await Hotel.find().populate('owner', 'name email');
//     res.json(hotels);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// /* ======================
//    GET HOTEL BY ID (Public)
// ====================== */
// router.get('/:id', async (req, res) => {
//   try {
//     const hotel = await Hotel.findById(req.params.id).populate('owner', 'name email');
//     if (!hotel) return res.status(404).json({ error: 'Hotel not found' });
//     res.json(hotel);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// /* ======================
//    CREATE HOTEL (Owner Only)
// ====================== */
// router.post('/', auth('owner'), async (req, res) => {
//   try {
//     const hotel = await Hotel.create({ ...req.body, owner: req.user.id });
//     res.status(201).json(hotel);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// /* ======================
//    UPDATE HOTEL (Owner Only, must own hotel)
// ====================== */
// router.put('/:id', auth('owner'), async (req, res) => {
//   try {
//     const hotel = await Hotel.findById(req.params.id);
//     if (!hotel) return res.status(404).json({ error: 'Hotel not found' });
//     if (hotel.owner.toString() !== req.user.id)
//       return res.status(403).json({ error: 'Not allowed' });

//     const updatedHotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     res.json(updatedHotel);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// /* ======================
//    DELETE HOTEL (Owner Only, must own hotel)
// ====================== */
// router.delete('/:id', auth('owner'), async (req, res) => {
//   try {
//     const hotel = await Hotel.findById(req.params.id);
//     if (!hotel) return res.status(404).json({ error: 'Hotel not found' });
//     if (hotel.owner.toString() !== req.user.id)
//       return res.status(403).json({ error: 'Not allowed' });

//     await Hotel.findByIdAndDelete(req.params.id);
//     res.json({ message: 'Hotel deleted' });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// export default router;


import express from 'express';
import Hotel from '../models/Hotel.js';
import auth from '../middleware/auth.js';

const router = express.Router();


router.get('/', async (req, res) => {
  try {
    const hotels = await Hotel.find().populate('owner', 'name email');
    res.json(hotels);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get('/:id', async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id).populate('owner', 'name email');
    if (!hotel) return res.status(404).json({ error: 'Hotel not found' });
    res.json(hotel);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.post('/', auth('owner'), async (req, res) => {
  try {
    const hotel = await Hotel.create({ ...req.body, owner: req.user.id });
    res.status(201).json(hotel);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});



router.put('/:id', auth('owner'), async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) return res.status(404).json({ error: 'Hotel not found' });
    if (hotel.owner.toString() !== req.user.id)
      return res.status(403).json({ error: 'Not allowed' });

    const updatedHotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedHotel);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ======================
   DELETE HOTEL (Owner Only, must own hotel)
====================== */
router.delete('/:id', auth('owner'), async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) return res.status(404).json({ error: 'Hotel not found' });
    if (hotel.owner.toString() !== req.user.id)
      return res.status(403).json({ error: 'Not allowed' });

    await Hotel.findByIdAndDelete(req.params.id);
    res.json({ message: 'Hotel deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
