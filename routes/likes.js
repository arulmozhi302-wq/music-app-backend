import express from 'express';
import Like from '../models/Like.js';
import Song from '../models/Song.js';
import Playlist from '../models/Playlist.js';
import User from '../models/User.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.post('/toggle', auth, async (req, res) => {
  try {
    const { targetType, targetId } = req.body;
    if (!targetType || !targetId) return res.status(400).json({ message: 'targetType and targetId required' });
    if (!['song', 'playlist'].includes(targetType)) return res.status(400).json({ message: 'Invalid targetType' });
    const existing = await Like.findOne({ user: req.user._id, targetType, targetId });
    const Model = targetType === 'song' ? Song : Playlist;
    if (existing) {
      await Like.findByIdAndDelete(existing._id);
      await Model.findByIdAndUpdate(targetId, { $inc: { likeCount: -1 } });
      await User.findByIdAndUpdate(req.user._id, targetType === 'song' ? { $pull: { likedSongs: targetId } } : { $pull: { likedPlaylists: targetId } });
      return res.json({ liked: false });
    }
    await Like.create({ user: req.user._id, targetType, targetId });
    await Model.findByIdAndUpdate(targetId, { $inc: { likeCount: 1 } });
    await User.findByIdAndUpdate(req.user._id, targetType === 'song' ? { $addToSet: { likedSongs: targetId } } : { $addToSet: { likedPlaylists: targetId } });
    res.json({ liked: true });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.get('/check', auth, async (req, res) => {
  try {
    const { targetType, targetId } = req.query;
    if (!targetType || !targetId) return res.status(400).json({ message: 'targetType and targetId required' });
    const liked = await Like.exists({ user: req.user._id, targetType, targetId });
    res.json({ liked: !!liked });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.get('/user', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('likedSongs').populate('likedPlaylists').select('likedSongs likedPlaylists').lean();
    res.json(user || { likedSongs: [], likedPlaylists: [] });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

export default router;
