import express from 'express';
import User from '../models/User.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get user by ID
router.get('/:id', auth(), async (req, res) => {
  try {
    // User can only view their own profile unless admin
    if (req.user.id !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update user
router.put('/:id', auth(), async (req, res) => {
  try {
    // User can only update their own profile
    if (req.user.id !== req.params.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    // Don't allow updating password or role through this route
    const { password, role, ...updateData } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete user
router.delete('/:id', auth(), async (req, res) => {
  try {
    // User can only delete their own account
    if (req.user.id !== req.params.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

