import mongoose from 'mongoose';
import app from '../app.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://b39-fsd:6m2ctkcWfghf5SRa@cluster0.aabihuz.mongodb.net/music-streaming';
const isLocalUri = !process.env.MONGODB_URI || MONGODB_URI.includes('localhost');

let dbPromise = null;
function connectDb() {
  if (dbPromise) return dbPromise;
  dbPromise = mongoose.connect(MONGODB_URI);
  return dbPromise;
}

export default async function handler(req, res) {
  if (process.env.VERCEL && isLocalUri) {
    res.status(500).json({
      message: 'Database connection failed',
      hint: 'Set MONGODB_URI (and JWT_SECRET) in Vercel → Project Settings → Environment Variables, then redeploy. Use a cloud DB (e.g. MongoDB Atlas).',
    });
    return;
  }
  try {
    await connectDb();
  } catch (err) {
    console.error('MongoDB connection error:', err);
    res.status(500).json({ message: 'Database connection failed' });
    return;
  }
  app(req, res);
}
