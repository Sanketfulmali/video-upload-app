const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/video_subtitles', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Subtitle Schema
const subtitleSchema = new mongoose.Schema({
  text: String,
  timestamp: Number,
});

const Subtitle = mongoose.model('Subtitle', subtitleSchema);

// Multer Configuration for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Express Middleware to handle JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (videos and subtitles)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Endpoints

// Upload video and subtitles
app.post('/api/upload', upload.single('video'), (req, res) => {
  const videoFile = req.file;
  const subtitleText = req.body.subtitles;

  // Save video and subtitles to MongoDB
  // For simplicity, we are not saving the video file in this example
  const newSubtitle = new Subtitle({
    text: subtitleText,
    timestamp: Date.now(), // For simplicity, timestamp is set to the current date/time
  });

  newSubtitle.save()
    .then(() => {
      res.json({ status: 'success' });
    })
    .catch((err) => {
      console.error('Error saving subtitle:', err);
      res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    });
});

// Get all subtitles
app.get('/api/subtitles', (req, res) => {
  Subtitle.find({})
    .then((subtitles) => {
      res.json(subtitles);
    })
    .catch((err) => {
      console.error('Error fetching subtitles:', err);
      res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
