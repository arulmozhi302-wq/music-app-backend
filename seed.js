import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Song from './models/Song.js';
import Playlist from './models/Playlist.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/music-streaming';

const sampleSongs = [
  { title: 'Ponni Nadhi', artist: 'A.R. Rahman', album: 'RRR', genre: 'Tamil', movieName: 'RRR', duration: 245, audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', coverUrl: 'https://picsum.photos/300/300?random=1', playCount: 0, likeCount: 0 },
  { title: 'Naa Ready', artist: 'Thalapathy Vijay, Anirudh', album: 'Leo', genre: 'Tamil', movieName: 'Leo', duration: 234, audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', coverUrl: 'https://picsum.photos/300/300?random=2', playCount: 0, likeCount: 0 },
  { title: 'Hukum', artist: 'Anirudh', album: 'Jailer', genre: 'Tamil', movieName: 'Jailer', duration: 220, audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', coverUrl: 'https://picsum.photos/300/300?random=3', playCount: 0, likeCount: 0 },
  { title: 'Aga Naga', artist: 'A.R. Rahman', album: 'Ponniyin Selvan 2', genre: 'Melody', movieName: 'PS-2', duration: 268, audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', coverUrl: 'https://picsum.photos/300/300?random=4', playCount: 0, likeCount: 0 },
  { title: 'Vaathi Coming', artist: 'Anirudh', album: 'Master', genre: 'Tamil', movieName: 'Master', duration: 252, audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3', coverUrl: 'https://picsum.photos/300/300?random=5', playCount: 0, likeCount: 0 },
  { title: 'Arabic Kuthu', artist: 'Anirudh', album: 'Vikram', genre: 'Tamil', movieName: 'Vikram', duration: 238, audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3', coverUrl: 'https://picsum.photos/300/300?random=6', playCount: 0, likeCount: 0 },
  { title: 'Enjoy Enjaami', artist: 'Dhee, Arivu', album: 'Enjoy Enjaami', genre: 'Melody', movieName: '', duration: 285, audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3', coverUrl: 'https://picsum.photos/300/300?random=7', playCount: 0, likeCount: 0 },
  { title: 'Raa Raa', artist: 'Devi Sri Prasad', album: 'Beast', genre: 'Tamil', movieName: 'Beast', duration: 198, audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3', coverUrl: 'https://picsum.photos/300/300?random=8', playCount: 0, likeCount: 0 },
  { title: 'Jolly O Gymkhana', artist: 'Anirudh', album: 'Jailer', genre: 'Tamil', movieName: 'Jailer', duration: 212, audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3', coverUrl: 'https://picsum.photos/300/300?random=9', playCount: 0, likeCount: 0 },
  { title: 'Kaadhal En Kaviye', artist: 'Sid Sriram', album: 'Salar', genre: 'Melody', movieName: 'Salar', duration: 276, audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3', coverUrl: 'https://picsum.photos/300/300?random=10', playCount: 0, likeCount: 0 },
  { title: 'Chilla Chilla', artist: 'Thaman S', album: 'RRR', genre: 'Tamil', movieName: 'RRR', duration: 224, audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3', coverUrl: 'https://picsum.photos/300/300?random=11', playCount: 0, likeCount: 0 },
  { title: 'Bullet', artist: 'A.R. Rahman', album: 'Ponniyin Selvan', genre: 'Tamil', movieName: 'PS-1', duration: 245, audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3', coverUrl: 'https://picsum.photos/300/300?random=12', playCount: 0, likeCount: 0 },
  { title: 'Once Upon a Time', artist: 'Anirudh', album: 'Jailer', genre: 'Tamil', movieName: 'Jailer', duration: 258, audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3', coverUrl: 'https://picsum.photos/300/300?random=13', playCount: 0, likeCount: 0 },
  { title: 'Naan Gaali', artist: 'Anirudh', album: 'Jailer', genre: 'Tamil', movieName: 'Jailer', duration: 242, audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3', coverUrl: 'https://picsum.photos/300/300?random=14', playCount: 0, likeCount: 0 },
  { title: 'Vikram Title Track', artist: 'Anirudh', album: 'Vikram', genre: 'Tamil', movieName: 'Vikram', duration: 195, audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3', coverUrl: 'https://picsum.photos/300/300?random=15', playCount: 0, likeCount: 0 },
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
    preferredGenres: ['Tamil'],
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
