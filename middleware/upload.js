import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const audioStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads/audio');
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname) || '.mp3';
    cb(null, unique + ext);
  },
});

const coverStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads/covers');
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, unique + ext);
  },
});

export const uploadAudio = multer({
  storage: audioStorage,
  limits: { fileSize: 25 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /\.(mp3|m4a|wav|ogg)$/i;
    if (allowed.test(file.originalname) || file.mimetype?.startsWith('audio/')) {
      cb(null, true);
    } else {
      cb(new Error('Only audio files (mp3, m4a, wav, ogg) are allowed'));
    }
  },
});

export const uploadCover = multer({
  storage: coverStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /\.(jpg|jpeg|png|gif|webp)$/i;
    if (allowed.test(file.originalname) || file.mimetype?.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (jpg, png, gif, webp) are allowed'));
    }
  },
});

const songUploadStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = file.fieldname === 'cover' ? 'covers' : 'audio';
    const uploadPath = path.join(__dirname, `../uploads/${dir}`);
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = file.fieldname === 'cover' ? (path.extname(file.originalname) || '.jpg') : (path.extname(file.originalname) || '.mp3');
    cb(null, unique + ext);
  },
});

export const uploadAudioAndCover = multer({
  storage: songUploadStorage,
  limits: { fileSize: 25 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'audio') {
      const allowed = /\.(mp3|m4a|wav|ogg)$/i;
      if (allowed.test(file.originalname) || file.mimetype?.startsWith('audio/')) cb(null, true);
      else cb(new Error('Only audio files (mp3, m4a, wav, ogg) are allowed'));
    } else {
      const allowed = /\.(jpg|jpeg|png|gif|webp)$/i;
      if (allowed.test(file.originalname) || file.mimetype?.startsWith('image/')) cb(null, true);
      else cb(new Error('Only image files (jpg, png, gif, webp) are allowed'));
    }
  },
});
