import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.js';
import songsRoutes from './routes/songs.js';
import playlistsRoutes from './routes/playlists.js';
import commentsRoutes from './routes/comments.js';
import likesRoutes from './routes/likes.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/songs', songsRoutes);
app.use('/api/playlists', playlistsRoutes);
app.use('/api/comments', commentsRoutes);
app.use('/api/likes', likesRoutes);

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/music-streaming';

mongoose.connect(MONGODB_URI).then(() => {
  console.log('MongoDB connected');
  const server = app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use. Stop the other process or set a different PORT in .env`);
    } else {
      console.error('Server error:', err);
    }
    process.exit(1);
  });
}).catch(err => console.error('MongoDB connection error:', err));
