import express from 'express';
import bcrypt from 'bcryptjs';
import Owner from '../models/Owner.js';
import hashPassword from '../utils/passwordHashing.js';
import generateToken from '../utils/generateToken.js';
import auth from '../middleware/auth.js';
import Hotel from '../models/Hotel.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ error: 'All fields required' });

    const existingOwner = await Owner.findOne({ email });
    if (existingOwner) return res.status(400).json({ error: 'Email already exists' });

    const hashedPassword = await hashPassword(password);

    const owner = await Owner.create({
      name,
      email,
      password: hashedPassword,
      role: 'owner'
    });

    res.status(201).json({ message: 'Owner registered', owner });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email & password required' });

    const owner = await Owner.findOne({ email });
    if (!owner) return res.status(404).json({ error: 'Owner not found' });

    const isMatch = await bcrypt.compare(password, owner.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const token = generateToken(owner);
    res.json({
      message: 'Login successful',
      token,
      owner: {
        id: owner._id,
        name: owner.name,
        email: owner.email,
        role: owner.role
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// Get all owners
router.get('/', auth('owner'), async (req, res) => {
  const owners = await Owner.find().populate('hotels');
  res.json(owners);
});

// Get owner by ID
router.get('/:id', auth('owner'), async (req, res) => {
  const owner = await Owner.findById(req.params.id).populate('hotels');
  if (!owner) return res.status(404).json({ error: 'Owner not found' });
  res.json(owner);
});

// Create hotel for owner
router.post('/:ownerId/hotels', auth('owner'), async (req, res) => {
  try {
    if (req.user.id !== req.params.ownerId)
      return res.status(403).json({ error: 'Not allowed' });

    const hotel = await Hotel.create({ ...req.body, owner: req.params.ownerId });

    await Owner.findByIdAndUpdate(req.params.ownerId, { $push: { hotels: hotel._id } });

    res.status(201).json(hotel);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
