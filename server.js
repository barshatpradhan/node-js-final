import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

//Import MongoDB File
import { connectDb } from "./config/db.js";


// Import routes
import authRoutes from './routes/auth.js';       
import userRoutes from './routes/user.js';
import ownerRoutes from './routes/owner.js';
import hotelRoutes from './routes/hotels.js';
import bookingRoutes from './routes/booking.js';

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect MongoDB
connectDb();

// Routes
app.use('/api/auth', authRoutes);           
app.use('/api/user', userRoutes);         
app.use('/api/owner', ownerRoutes);       
app.use('/api/hotels', hotelRoutes);       
app.use('/api/bookings', bookingRoutes);    

// Health check
app.get('/', (req, res) => {
  res.json({ 
    message: 'Hotel Booking API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      owners: '/api/owners',
      hotels: '/api/hotels',
      bookings: '/api/bookings'
    }
  });
});

// Handle 404
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}`);
});