# 🎧 TuneFlow Backend API

TuneFlow Backend is a RESTful API for a music streaming application built with Node.js, Express, and MongoDB.
It provides APIs for managing songs, user authentication, playlists, likes, and comments.

The backend handles secure authentication, database operations, and cloud media storage.

------------------------------------------------------------------------

Frontend\
https://music-app-frontend-roan.vercel.app

Backend API\
https://music-app-backend-tawny.vercel.app

Songs API\
https://music-app-backend-tawny.vercel.app/api/songs


------------------------------------------------------------------------

## 🛠 Tech Stack

### Frontend

-   React
-   JavaScript
-   Tailwind CSS
-   HTML5
-   CSS3
-   Vite

### Backend

-   Node.js
-   Express.js
-   REST APIs
-   JWT Authentication

### Database

-   MongoDB
-   MongoDB Atlas

### Cloud & Tools

-   Cloudinary
-   Git
-   GitHub
-   Vercel
-   Postman

------------------------------------------------------------------------

## 🎵 Featured Project

### TuneFlow -- MERN Music Streaming App

A full‑stack music streaming application where users can:

-   Stream songs
-   Like tracks
-   Comment on songs
-   Create playlists
-   Upload music to cloud storage

**Tech Used** React • Node.js • Express • MongoDB • Cloudinary



------------------------------------------------------------------------

## 📁 Project Structure

````
backend
│
├── config
│   └── cloudinary.js
│
├── models
│   ├── Song.js
│   ├── User.js
│   ├── Playlist.js
│   ├── Comment.js
│   └── Like.js
│
├── routes
│   ├── auth.js
│   ├── songs.js
│   ├── playlists.js
│   ├── comments.js
│   └── likes.js
│
├── middleware
│   └── authMiddleware.js
│
├── app.js
├── server.js
└── package.json

````
------------------------------------------------------------------------

## ⚙️ Environment Variables

Create a .env file in the backend root.

````
PORT=5000

MONGODB_URI=your_mongodb_atlas_connection_string

JWT_SECRET=your_secret_key

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

````
------------------------------------------------------------------------

## 📡 API Endpoints
Auth

```
POST /api/auth/register
POST /api/auth/login

```

------------------------------------------------------------------------

## Songs

```
GET /api/songs
GET /api/songs/:id
POST /api/songs
PUT /api/songs/:id
DELETE /api/songs/:id

```

------------------------------------------------------------------------
## Playlists

```
GET /api/playlists
POST /api/playlists
DELETE /api/playlists/:id

```

------------------------------------------------------------------------
## Comments & likes

```
GET /api/comments/:songId
POST /api/comments

POST /api/likes/:songId
DELETE /api/likes/:songId
```

------------------------------------------------------------------------


## 👨‍💻 Author

**Arulmozhi D**  
MERN Stack Developer
Frontend & Backend Developer

------------------------------------------------------------------------


⭐ Always learning new technologies and improving my development skills.
