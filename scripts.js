const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all requests
app.use(cors());

// Set up multer storage engine to store videos in 'uploads' folder
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads'); // Store uploaded videos in 'uploads' directory
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)); // Ensure unique filenames
    }
});

const upload = multer({ storage: storage });

// Serve static files (videos) from the 'uploads' directory
app.use('/uploads', express.static('uploads'));

// Endpoint to handle video uploads
app.post('/upload', upload.single('video'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded.' });
    }
    const videoUrl = `/uploads/${req.file.filename}`;
    res.json({ videoUrl: videoUrl });
});

// Endpoint to get the list of uploaded videos
app.get('/videos', (req, res) => {
    const videoDirectory = path.join(__dirname, 'uploads');
    fs.readdir(videoDirectory, (err, files) => {
        if (err) {
            return res.status(500).json({ message: 'Error reading video directory.' });
        }

        // Filter out non-video files (you can expand this to check more formats)
        const videoFiles = files.filter(file => file.endsWith('.mp4'));

        // Map video file names to URLs
        const videoUrls = videoFiles.map(file => `/uploads/${file}`);
        res.json(videoUrls);
    });
});

// Serve the frontend files (optional if hosting frontend elsewhere)
app.use(express.static('public'));

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
