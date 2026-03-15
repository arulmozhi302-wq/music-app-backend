import mongoose from 'mongoose';
import app from '../app.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/music-streaming';

let dbPromise = null;
function connectDb() {
  if (dbPromise) return dbPromise;
  dbPromise = mongoose.connect(MONGODB_URI);
  return dbPromise;
}

export default async function handler(req, res) {
  try {
    await connectDb();
  } catch (err) {
    console.error('MongoDB connection error:', err);
    res.status(500).json({ message: 'Database connection failed' });
    return;
  }
  app(req, res);
}
