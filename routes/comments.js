import express from 'express';
import Comment from '../models/Comment.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

const getComments = async (targetType, targetId) => {
  return Comment.find({ targetType, targetId })
    .populate('user', 'username')
    .sort({ createdAt: -1 })
    .lean();
};

router.get('/', async (req, res) => {
  try {
    const { targetType, targetId } = req.query;
    if (!targetType || !targetId) return res.status(400).json({ message: 'targetType and targetId required' });
    const comments = await getComments(targetType, targetId);
    res.json(comments);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { targetType, targetId, text } = req.body;
    if (!targetType || !targetId || !text?.trim()) return res.status(400).json({ message: 'targetType, targetId and text required' });
    if (!['song', 'playlist'].includes(targetType)) return res.status(400).json({ message: 'Invalid targetType' });
    const comment = await Comment.create({
      user: req.user._id,
      targetType,
      targetId,
      text: text.trim(),
    });
    await comment.populate('user', 'username');
    res.status(201).json(comment);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const comment = await Comment.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!comment) return res.status(404).json({ message: 'Comment not found' });
    res.json({ message: 'Comment deleted' });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

export default router;
