const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// Enable CORS for development
app.use(cors());

// Configure Multer for file uploads
const upload = multer({
    dest: 'uploads/', // Directory where files will be stored
    limits: { fileSize: 100 * 1024 * 1024 }, // Limit: 100MB
});

app.post('/upload', upload.single('video'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    // Respond with success
    res.send('File uploaded successfully.');
});

// Serve uploaded videos (optional, for demonstration purposes)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
