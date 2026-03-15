/**
 * Migrate existing songs (local /uploads/ files) to Cloudinary.
 * Run from backend folder: node scripts/migrate-songs-to-cloudinary.js
 *
 * Requires: .env with MONGODB_URI and CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
 */

import 'dotenv/config';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import cloudinary, { isConfigured as cloudinaryConfigured } from '../config/cloudinary.js';
import Song from '../models/Song.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const backendRoot = path.join(__dirname, '..');

async function migrate() {
  if (!cloudinaryConfigured) {
    console.error('Cloudinary not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET in .env');
    process.exit(1);
  }

  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/music-streaming';
  await mongoose.connect(MONGODB_URI);
  console.log('MongoDB connected');

  const songs = await Song.find({
    $or: [
      { audioUrl: { $regex: '^/uploads/' } },
      { coverUrl: { $regex: '^/uploads/' } },
    ],
  }).lean();

  console.log(`Found ${songs.length} song(s) with local uploads to migrate.\n`);

  let ok = 0;
  let err = 0;

  for (const song of songs) {
    const id = song._id.toString();
    let newAudioUrl = song.audioUrl;
    let newCoverUrl = song.coverUrl || '';

    try {
      if (song.audioUrl && song.audioUrl.startsWith('/uploads/')) {
        const audioPath = path.join(backendRoot, song.audioUrl.replace(/^\//, ''));
        if (fs.existsSync(audioPath)) {
          const result = await cloudinary.uploader.upload(audioPath, {
            resource_type: 'video',
            folder: 'audio',
            use_filename: true,
            unique_filename: true,
          });
          newAudioUrl = result.secure_url;
          console.log(`  [${song.title}] audio -> Cloudinary`);
        } else {
          console.warn(`  [${song.title}] audio file not found: ${audioPath}`);
        }
      }

      if (song.coverUrl && song.coverUrl.startsWith('/uploads/')) {
        const coverPath = path.join(backendRoot, song.coverUrl.replace(/^\//, ''));
        if (fs.existsSync(coverPath)) {
          const result = await cloudinary.uploader.upload(coverPath, {
            folder: 'covers',
            use_filename: true,
            unique_filename: true,
          });
          newCoverUrl = result.secure_url;
          console.log(`  [${song.title}] cover -> Cloudinary`);
        } else {
          console.warn(`  [${song.title}] cover file not found: ${coverPath}`);
        }
      }

      await Song.updateOne(
        { _id: song._id },
        { $set: { audioUrl: newAudioUrl, coverUrl: newCoverUrl } }
      );
      ok++;
    } catch (e) {
      console.error(`  [${song.title}] Error:`, e.message);
      err++;
    }
  }

  console.log(`\nDone. Updated: ${ok}, errors: ${err}`);
  await mongoose.disconnect();
  process.exit(err > 0 ? 1 : 0);
}

migrate().catch((e) => {
  console.error(e);
  process.exit(1);
});
