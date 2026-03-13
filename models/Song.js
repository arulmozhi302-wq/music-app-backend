import mongoose from 'mongoose';

const songSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artist: { type: String, required: true },
  album: { type: String, default: '' },
  genre: { type: String, required: true },
  movieName: { type: String, default: '' },
  duration: { type: Number, required: true },
  audioUrl: { type: String, required: true },
  coverUrl: { type: String, default: '' },
  playCount: { type: Number, default: 0 },
  likeCount: { type: Number, default: 0 },
}, { timestamps: true });

songSchema.index({ title: 'text', artist: 'text', album: 'text', genre: 'text', movieName: 'text' });

export default mongoose.model('Song', songSchema);
