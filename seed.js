import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Song from './models/Song.js';
import Playlist from './models/Playlist.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/music-streaming';

const sampleSongs = [
  { title: 'Blinding Lights', artist: 'The Weeknd', album: 'After Hours', genre: 'Pop', movieName: '', duration: 200, audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', coverUrl: 'https://picsum.photos/300/300?random=1', playCount: 0, likeCount: 0 },
  { title: 'Shape of You', artist: 'Ed Sheeran', album: '÷', genre: 'Pop', movieName: '', duration: 234, audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', coverUrl: 'https://picsum.photos/300/300?random=2', playCount: 0, likeCount: 0 },
  { title: 'Bohemian Rhapsody', artist: 'Queen', album: 'A Night at the Opera', genre: 'Rock', movieName: '', duration: 355, audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', coverUrl: 'https://picsum.photos/300/300?random=3', playCount: 0, likeCount: 0 },
  { title: 'Uptown Funk', artist: 'Bruno Mars', album: 'Uptown Special', genre: 'Pop', movieName: '', duration: 269, audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', coverUrl: 'https://picsum.photos/300/300?random=4', playCount: 0, likeCount: 0 },
  { title: 'See You Again', artist: 'Wiz Khalifa', album: 'Furious 7', genre: 'Hip Hop', movieName: 'Furious 7', duration: 229, audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3', coverUrl: 'https://picsum.photos/300/300?random=5', playCount: 0, likeCount: 0 },
  { title: 'Rolling in the Deep', artist: 'Adele', album: '21', genre: 'Pop', movieName: '', duration: 228, audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3', coverUrl: 'https://picsum.photos/300/300?random=6', playCount: 0, likeCount: 0 },
  { title: 'Smells Like Teen Spirit', artist: 'Nirvana', album: 'Nevermind', genre: 'Rock', movieName: '', duration: 301, audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3', coverUrl: 'https://picsum.photos/300/300?random=7', playCount: 0, likeCount: 0 },
  { title: 'Hotel California', artist: 'Eagles', album: 'Hotel California', genre: 'Rock', movieName: '', duration: 391, audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3', coverUrl: 'https://picsum.photos/300/300?random=8', playCount: 0, likeCount: 0 },
  { title: 'Titanium', artist: 'David Guetta', album: 'Nothing but the Beat', genre: 'Electronic', movieName: '', duration: 245, audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3', coverUrl: 'https://picsum.photos/300/300?random=9', playCount: 0, likeCount: 0 },
  { title: 'Perfect', artist: 'Ed Sheeran', album: '÷', genre: 'Pop', movieName: '', duration: 263, audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3', coverUrl: 'https://picsum.photos/300/300?random=10', playCount: 0, likeCount: 0 },
  { title: 'Someone Like You', artist: 'Adele', album: '21', genre: 'Pop', movieName: '', duration: 285, audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3', coverUrl: 'https://picsum.photos/300/300?random=11', playCount: 0, likeCount: 0 },
  { title: 'Stairway to Heaven', artist: 'Led Zeppelin', album: 'Led Zeppelin IV', genre: 'Rock', movieName: '', duration: 482, audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3', coverUrl: 'https://picsum.photos/300/300?random=12', playCount: 0, likeCount: 0 },
  { title: 'Despacito', artist: 'Luis Fonsi', album: 'Vida', genre: 'Latin', movieName: '', duration: 282, audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3', coverUrl: 'https://picsum.photos/300/300?random=13', playCount: 0, likeCount: 0 },
  { title: 'Happy', artist: 'Pharrell Williams', album: 'G I R L', genre: 'Pop', movieName: 'Despicable Me 2', duration: 233, audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3', coverUrl: 'https://picsum.photos/300/300?random=14', playCount: 0, likeCount: 0 },
  { title: 'Radioactive', artist: 'Imagine Dragons', album: 'Night Visions', genre: 'Rock', movieName: '', duration: 186, audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3', coverUrl: 'https://picsum.photos/300/300?random=15', playCount: 0, likeCount: 0 },
];

async function seed() {
  await mongoose.connect(MONGODB_URI);
  await User.deleteMany({});
  await Song.deleteMany({});
  await Playlist.deleteMany({});

  const hashed = await bcrypt.hash('password123', 10);
  const user = await User.create({
    username: 'demo',
    email: 'demo@music.app',
    password: hashed,
    preferredGenres: ['Pop', 'Rock'],
  });

  const songs = await Song.insertMany(sampleSongs);
  await Playlist.create({
    name: 'My Favorites',
    description: 'Demo playlist',
    owner: user._id,
    songs: songs.slice(0, 5).map(s => s._id),
    isPublic: true,
  });

  console.log('Seed done: 1 user (demo@music.app / password123),', songs.length, 'songs, 1 playlist');
  process.exit(0);
}

seed().catch(e => { console.error(e); process.exit(1); });
