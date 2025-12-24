import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import authRoutes from './routes/auth.js';      
import userRoutes from './routes/user.js';      
import ownerRoutes from './routes/owner.js';    
import hotelRoutes from './routes/hotels.js';    
import bookingRoutes from './routes/booking.js';

dotenv.config();
const app = express();

// Parse JSON
app.use(express.json());

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Routes
app.use('/api/auth', authRoutes);       
app.use('/api/users', userRoutes);      
app.use('/api/owners', ownerRoutes);    
app.use('/api/hotels', hotelRoutes);    
app.use('/api/bookings', bookingRoutes);

// Handle 404
app.use((req, res) => res.status(404).json({ error: 'Route not found' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
