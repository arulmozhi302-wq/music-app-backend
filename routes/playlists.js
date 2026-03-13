import express from 'express';
import Playlist from '../models/Playlist.js';
import Song from '../models/Song.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const playlists = await Playlist.find({ owner: req.user._id }).populate('songs').sort({ updatedAt: -1 }).lean();
    res.json(playlists);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.get('/public', async (req, res) => {
  try {
    const playlists = await Playlist.find({ isPublic: true }).populate('owner', 'username').populate('songs').sort({ likeCount: -1 }).limit(30).lean();
    res.json(playlists);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id).populate('songs').populate('owner', 'username').lean();
    if (!playlist) return res.status(404).json({ message: 'Playlist not found' });
    res.json(playlist);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { name, description, isPublic = true } = req.body;
    if (!name) return res.status(400).json({ message: 'Playlist name required' });
    const playlist = await Playlist.create({
      name,
      description: description || '',
      owner: req.user._id,
      isPublic: !!isPublic,
      songs: [],
    });
    res.status(201).json(playlist);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.patch('/:id', auth, async (req, res) => {
  try {
    const playlist = await Playlist.findOne({ _id: req.params.id, owner: req.user._id });
    if (!playlist) return res.status(404).json({ message: 'Playlist not found' });
    const { name, description, isPublic, songs } = req.body;
    if (name !== undefined) playlist.name = name;
    if (description !== undefined) playlist.description = description;
    if (isPublic !== undefined) playlist.isPublic = isPublic;
    if (Array.isArray(songs)) playlist.songs = songs;
    await playlist.save();
    res.json(playlist);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.post('/:id/songs', auth, async (req, res) => {
  try {
    const { songId } = req.body;
    if (!songId) return res.status(400).json({ message: 'songId required' });
    const playlist = await Playlist.findOne({ _id: req.params.id, owner: req.user._id });
    if (!playlist) return res.status(404).json({ message: 'Playlist not found' });
    if (playlist.songs.some(s => s.toString() === songId)) return res.json(playlist);
    playlist.songs.push(songId);
    await playlist.save();
    await playlist.populate('songs');
    res.json(playlist);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.delete('/:id/songs/:songId', auth, async (req, res) => {
  try {
    const playlist = await Playlist.findOne({ _id: req.params.id, owner: req.user._id });
    if (!playlist) return res.status(404).json({ message: 'Playlist not found' });
    playlist.songs = playlist.songs.filter(s => s.toString() !== req.params.songId);
    await playlist.save();
    await playlist.populate('songs');
    res.json(playlist);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const playlist = await Playlist.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    if (!playlist) return res.status(404).json({ message: 'Playlist not found' });
    res.json({ message: 'Playlist deleted' });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

export default router;
