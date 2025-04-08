import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

import authRoutes from './routes/auth.js';
import spendRoutes from './routes/spend.js';
import workoutRoutes from "./routes/workout.js";

// config
dotenv.config();
const app = express();
const DEFAULT_PORT = 5000;
const URL = process.env.MONGO_URL;

app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(URL)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error(err));

// Set up auth routes
app.use('/auth', authRoutes);
app.use('/spend', spendRoutes);
app.use('/workout', workoutRoutes);

// Start the server using the HTTP server (which includes Socket.io)
function startServer(port) {
  const server = app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${port} in use, trying ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error(err);
    }
  });
}

startServer(DEFAULT_PORT);

export default app;
