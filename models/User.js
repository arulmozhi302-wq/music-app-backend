import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  avatar: { type: String, default: '' },
  likedSongs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song' }],
  likedPlaylists: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Playlist' }],
  preferredGenres: [{ type: String }],
}, { timestamps: true });

export default mongoose.model('User', userSchema);
