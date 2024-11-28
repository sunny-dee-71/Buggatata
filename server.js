const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');

// Initialize app
const app = express();
app.use(cors()); // Enable CORS for front-end communication

// Setup file upload storage using multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads'); // Save uploaded files in 'uploads' folder
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename with extension
    }
});

const upload = multer({ storage: storage });

// Serve video files from 'uploads' folder
app.use('/videos', express.static('uploads'));

// Endpoint to upload videos
app.post('/upload', upload.single('video'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No video file uploaded');
    }
    res.status(200).send({ videoUrl: `/videos/${req.file.filename}` });
});

// Example endpoint for getting video list
app.get('/videos', (req, res) => {
    const videoFiles = []; // This would be populated with filenames from the 'uploads' folder
    res.json(videoFiles);
});

// Start the server on Render's provided port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
