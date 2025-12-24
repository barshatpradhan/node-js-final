import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Owner from '../models/Owner.js';
import hashPassword from '../utils/passwordHashing.js';
import generateToken from '../utils/generateToken.js';

const router = express.Router();

// USER ROUTES

// User Register
router.post('/user/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const hashed = await hashPassword(password);
    const user = await User.create({ name, email, password: hashed, role: 'user' });

    const userResponse = { 
      id: user._id, 
      name: user.name, 
      email: user.email, 
      role: user.role 
    };
    res.status(201).json({ message: 'User registered', user: userResponse });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// User Login
router.post('/user/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email & password required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user);
    res.json({ 
      message: 'Login successful', 
      token,
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role 
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// OWNERS ROUTES

// Owner Register
router.post('/owner/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields required' });
    }

    const existingOwner = await Owner.findOne({ email });
    if (existingOwner) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const hashedPassword = await hashPassword(password);
    const owner = await Owner.create({
      name,
      email,
      password: hashedPassword,
      role: 'owner'
    });

    const ownerResponse = { 
      id: owner._id, 
      name: owner.name, 
      email: owner.email, 
      role: owner.role 
    };
    res.status(201).json({ message: 'Owner registered', owner: ownerResponse });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Owner Login
router.post('/owner/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email & password required' });
    }

    const owner = await Owner.findOne({ email });
    if (!owner) {
      return res.status(404).json({ error: 'Owner not found' });
    }

    const isMatch = await bcrypt.compare(password, owner.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

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

export default router;
