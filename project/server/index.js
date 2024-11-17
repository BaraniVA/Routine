import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { routineRouter } from './routes/routines.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

console.log('MONGODB_URI:', process.env.MONGODB_URI); // Verify MONGODB_URI

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

app.use('/api/routines', routineRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});