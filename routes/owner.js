import express from 'express';
import Owner from '../models/Owner.js';
import Hotel from '../models/Hotel.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get all owners (owner only)
router.get('/', auth('owner'), async (req, res) => {
  try {
    const owners = await Owner.find().select('-password').populate('hotels');
    res.json(owners);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get owner by ID (owner only - can view own profile)
router.get('/:id', auth('owner'), async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const owner = await Owner.findById(req.params.id)
      .select('-password')
      .populate('hotels');
    
    if (!owner) {
      return res.status(404).json({ error: 'Owner not found' });
    }
    res.json(owner);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create hotel for owner
router.post('/:ownerId/hotels', auth('owner'), async (req, res) => {
  try {
    // Owner can only create hotels for themselves
    if (req.user.id !== req.params.ownerId) {
      return res.status(403).json({ error: 'Not allowed' });
    }

    const { name, location, pricePerNight } = req.body;
    if (!name || !location || !pricePerNight) {
      return res.status(400).json({ error: 'All fields required' });
    }

    const hotel = await Hotel.create({
      name,
      location,
      pricePerNight,
      owner: req.params.ownerId
    });

    // Add hotel to owner's hotels array
    await Owner.findByIdAndUpdate(
      req.params.ownerId,
      { $push: { hotels: hotel._id } }
    );

    const populatedHotel = await Hotel.findById(hotel._id)
      .populate('owner', 'name email');
    
    res.status(201).json(populatedHotel);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get owner's hotels
router.get('/:ownerId/hotels', auth('owner'), async (req, res) => {
  try {
    // Owner can only view their own hotels
    if (req.user.id !== req.params.ownerId) {
      return res.status(403).json({ error: 'Not allowed' });
    }

    const hotels = await Hotel.find({ owner: req.params.ownerId });
    res.json(hotels);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update owner profile
router.put('/:id', auth('owner'), async (req, res) => {
  try {
    // Owner can only update their own profile
    if (req.user.id !== req.params.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    // Don't allow updating password or role through this route
    const { password, role, ...updateData } = req.body;

    const updatedOwner = await Owner.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedOwner) {
      return res.status(404).json({ error: 'Owner not found' });
    }
    res.json(updatedOwner);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete owner account
router.delete('/:id', auth('owner'), async (req, res) => {
  try {
    // Owner can only delete their own account
    if (req.user.id !== req.params.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const owner = await Owner.findByIdAndDelete(req.params.id);
    if (!owner) {
      return res.status(404).json({ error: 'Owner not found' });
    }

    // Delete all hotels owned by this owner
    await Hotel.deleteMany({ owner: req.params.id });

    res.json({ message: 'Owner deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
