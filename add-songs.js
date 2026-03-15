/**
 * Add Tamil songs from local MP3 files to the database.
 *
 * 1. Place your MP3 files in: backend/uploads/audio/to-add/
 * 2. Create songs.json in backend folder with this format:
 *    [
 *      { "file": "Ponni-Nadhi.mp3", "title": "Ponni Nadhi", "artist": "A.R. Rahman", "album": "RRR", "genre": "Tamil", "movieName": "RRR", "duration": 245 },
 *      ...
 *    ]
 * 3. Run: node add-songs.js
 *
 * Files will be moved from to-add/ to audio/ and songs will be created.
 */
import 'dotenv/config';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Song from './models/Song.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/music-streaming';
const TO_ADD = path.join(__dirname, 'uploads/audio/to-add');
const AUDIO_DIR = path.join(__dirname, 'uploads/audio');

async function addSongs() {
  const configPath = path.join(__dirname, 'songs.json');
  if (!fs.existsSync(configPath)) {
    console.log('Create songs.json with your song list. Example:');
    console.log(JSON.stringify([
      { file: 'Ponni-Nadhi.mp3', title: 'Ponni Nadhi', artist: 'A.R. Rahman', album: 'RRR', genre: 'Tamil', movieName: 'RRR', duration: 245 },
    ], null, 2));
    process.exit(1);
  }

  const songs = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  if (!Array.isArray(songs) || songs.length === 0) {
    console.log('songs.json must be an array with at least one song.');
    process.exit(1);
  }

  if (!fs.existsSync(TO_ADD)) {
    fs.mkdirSync(TO_ADD, { recursive: true });
    console.log('Created', TO_ADD, '- add your MP3 files and songs.json, then run again.');
    process.exit(0);
  }

  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  let added = 0;
  for (const s of songs) {
    const srcPath = path.join(TO_ADD, s.file);
    if (!fs.existsSync(srcPath)) {
      console.warn('Skip:', s.file, '- file not found');
      continue;
    }
    const ext = path.extname(s.file);
    const destName = Date.now() + '-' + Math.round(Math.random() * 1e9) + ext;
    const destPath = path.join(AUDIO_DIR, destName);
    fs.renameSync(srcPath, destPath);
    const audioUrl = '/uploads/audio/' + destName;
    await Song.create({
      title: s.title || path.basename(s.file, ext),
      artist: s.artist || 'Unknown',
      album: (s.album || '').trim(),
      genre: (s.genre || 'Tamil').trim(),
      movieName: (s.movieName || '').trim(),
      duration: Number(s.duration) || 180,
      audioUrl,
      coverUrl: s.coverUrl || '',
    });
    console.log('Added:', s.title);
    added++;
  }

  console.log('Done. Added', added, 'songs.');
  process.exit(0);
}

addSongs().catch((e) => { console.error(e); process.exit(1); });
