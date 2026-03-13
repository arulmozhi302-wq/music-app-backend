import express from 'express';
import { Readable } from 'stream';
import Song from '../models/Song.js';
import { auth, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', optionalAuth, async (req, res) => {
  try {
    const { genre, limit = 50, skip = 0 } = req.query;
    const filter = genre ? { genre } : {};
    let songs = await Song.find(filter).sort({ playCount: -1, createdAt: -1 }).skip(Number(skip)).limit(Number(limit)).lean();
    if (req.user?.preferredGenres?.length) {
      const preferred = await Song.find({ genre: { $in: req.user.preferredGenres } }).sort({ playCount: -1 }).limit(20).lean();
      const ids = new Set(preferred.map(s => s._id.toString()));
      songs = [...preferred, ...songs.filter(s => !ids.has(s._id.toString()))];
    }
    res.json(songs);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim().length === 0) return res.json([]);
    const songs = await Song.find({ $text: { $search: q.trim() } }, { score: { $meta: 'textScore' } })
      .sort({ score: { $meta: 'textScore' } })
      .limit(50)
      .lean();
    if (songs.length === 0) {
      const regex = new RegExp(q.trim(), 'i');
      const fallback = await Song.find({
        $or: [
          { title: regex },
          { artist: regex },
          { album: regex },
          { genre: regex },
          { movieName: regex },
        ],
      }).limit(50).lean();
      return res.json(fallback);
    }
    res.json(songs);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.get('/genres', async (req, res) => {
  try {
    const genres = await Song.distinct('genre');
    res.json(genres.sort());
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.get('/recommended', optionalAuth, async (req, res) => {
  try {
    const genres = req.user?.preferredGenres?.length ? req.user.preferredGenres : ['Pop', 'Rock', 'Hip Hop'];
    const songs = await Song.find({ genre: { $in: genres } }).sort({ playCount: -1, likeCount: -1 }).limit(20).lean();
    res.json(songs);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const song = await Song.findById(req.params.id).lean();
    if (!song) return res.status(404).json({ message: 'Song not found' });
    await Song.findByIdAndUpdate(req.params.id, { $inc: { playCount: 1 } });
    song.playCount = (song.playCount || 0) + 1;
    res.json(song);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.get('/:id/download', async (req, res) => {
  try {
    const song = await Song.findById(req.params.id).lean();
    if (!song) return res.status(404).json({ message: 'Song not found' });
    const url = song.audioUrl;
    const filename = `${song.title.replace(/[^a-zA-Z0-9-_]/g, '_')}.mp3`;
    if (url.startsWith('http')) {
      const r = await fetch(url);
      if (!r.ok) return res.status(r.status).json({ message: 'Failed to fetch audio' });
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Type', r.headers.get('content-type') || 'audio/mpeg');
      Readable.fromWeb(r.body).pipe(res);
    } else {
      res.redirect(url);
    }
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

export default router;
