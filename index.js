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
const port = 5000;
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
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

export default app;
