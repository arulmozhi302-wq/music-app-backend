import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import Song from './models/Song.js';

import './config/cloudinary.js';
import authRoutes from './routes/auth.js';
import songsRoutes from './routes/songs.js';
import playlistsRoutes from './routes/playlists.js';
import commentsRoutes from './routes/comments.js';
import likesRoutes from './routes/likes.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:5000",
    "http://localhost:3002",
    "https://music-app-frontend-roan.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true
}));

app.use(express.json()); 
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
  res.json({ ok: true, message: 'TuneFlow API', endpoints: ['/api/songs', '/api/auth', '/api/playlists', '/api/comments', '/api/likes', '/api/health'] });
});

// Check DB connection and song count (use in browser: http://localhost:5000/api/health)
app.get('/api/health', async (req, res) => {
  try {
    const dbState = mongoose.connection.readyState;
    const states = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };
    const songCount = dbState === 1 ? await Song.countDocuments() : 0;
    const sampleSongs = dbState === 1 ? await Song.find({}).limit(5).select('title artist genre').lean() : [];
    res.json({
      ok: dbState === 1,
      database: states[dbState] || 'unknown',
      songCount,
      sampleSongs,
      hint: songCount === 0 && dbState === 1 ? 'Run: npm run seed (in backend folder) to add songs' : undefined,
    });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/songs', songsRoutes);
app.use('/api/playlists', playlistsRoutes);
app.use('/api/comments', commentsRoutes);
app.use('/api/likes', likesRoutes);

export default app;
