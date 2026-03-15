import express from 'express';
import cors from 'cors';
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

export default app;
