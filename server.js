const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');

// Initialize the app and set port
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());  // Enable CORS for all routes
app.use(express.static('public'));  // Serve static files (HTML, CSS, JS)

// Set up file storage with Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');  // Set the destination folder for uploads
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));  // Use timestamp for unique file names
    }
});

const upload = multer({ storage: storage });

// Handle video upload route
app.post('/upload', upload.single('video'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    res.send('File uploaded successfully.');
});

// Serve the homepage (index.html)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
