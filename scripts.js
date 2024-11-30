const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');
const cors = require('cors'); // Import CORS package

// Load environment variables from .env file
dotenv.config();

const app = express();
const upload = multer();

// Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

// Enable CORS for all origins (or you can specify the exact frontend URL)
app.use(cors()); // This will allow your frontend to communicate with the backend

// Middleware to parse incoming JSON data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Endpoint to upload video
app.post('/upload', upload.single('video'), async (req, res) => {
    try {
        const fileStr = req.file.buffer.toString('base64'); // Convert buffer to base64 string

        // Upload video to Cloudinary without specifying a folder
        const uploadResponse = await cloudinary.uploader.upload(fileStr, {
            resource_type: 'video', // Specify the resource type as video
        });

        res.json({ url: uploadResponse.secure_url });
    } catch (error) {
        console.error('Error uploading video:', error);
        res.status(500).json({ message: 'Error uploading video' });
    }
});

// Endpoint to get videos from Cloudinary
app.get('/videos', async (req, res) => {
    try {
        const resources = await cloudinary.api.resources({
            type: 'upload',             // Type is 'upload' for media uploaded through your account
            resource_type: 'video',     // We're specifically working with video files
            max_results: 50,            // Adjust the number of results based on your needs
        });

        const videos = resources.resources.map((video) => ({
            url: video.secure_url,
            name: video.public_id,
        }));

        res.json(videos); // Return the list of videos
    } catch (error) {
        console.error('Error fetching videos:', error);
        res.status(500).json({ message: 'Error fetching videos' });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});