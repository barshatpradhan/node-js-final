import express from 'express';
import Hotel from '../models/Hotel.js';
import Owner from '../models/Owner.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get all hotels (public)
router.get('/', async (req, res) => {
  try {
    const hotels = await Hotel.find().populate('owner', 'name email');
    res.json(hotels);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get hotel by ID (public)
router.get('/:id', async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id)
      .populate('owner', 'name email');
    
    if (!hotel) {
      return res.status(404).json({ error: 'Hotel not found' });
    }
    res.json(hotel);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update hotel (owner only)
router.put('/:id', auth('owner'), async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) {
      return res.status(404).json({ error: 'Hotel not found' });
    }

    // Check if the owner owns this hotel
    if (hotel.owner.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to update this hotel' });
    }

    const { name, location, pricePerNight } = req.body;
    const updatedHotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      { name, location, pricePerNight },
      { new: true, runValidators: true }
    ).populate('owner', 'name email');

    res.json(updatedHotel);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete hotel (owner only)
router.delete('/:id', auth('owner'), async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) {
      return res.status(404).json({ error: 'Hotel not found' });
    }

    // Check if the owner owns this hotel
    if (hotel.owner.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to delete this hotel' });
    }

    await Hotel.findByIdAndDelete(req.params.id);

    // Remove hotel from owner's hotels array
    await Owner.findByIdAndUpdate(
      hotel.owner,
      { $pull: { hotels: req.params.id } }
    );

    res.json({ message: 'Hotel deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
