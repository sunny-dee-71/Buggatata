// Select elements
const uploadForm = document.getElementById('uploadForm');
const videoFileInput = document.getElementById('videoFile');
const videoNameInput = document.getElementById('videoName');
const uploadStatus = document.getElementById('uploadStatus');
const videoPlayer = document.getElementById('videoPlayer');
const videoSource = document.getElementById('videoSource');
const videoGrid = document.getElementById('videoGrid');

// Handle video upload
uploadForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the form from submitting normally

    const file = videoFileInput.files[0];
    const videoName = videoNameInput.value.trim();
    if (!file || !videoName) {
        uploadStatus.textContent = 'Please select a video file and provide a video name.';
        return;
    }

    // Create a thumbnail from the first frame
    const thumbnailUrl = await generateThumbnail(file);

    // Prepare form data
    const formData = new FormData();
    formData.append('video', file); // Attach video file to form data
    formData.append('video-name', videoName); // Attach video name
    formData.append('thumbnail', thumbnailUrl); // Attach thumbnail image as base64 string

    try {
        uploadStatus.textContent = 'Uploading...';

        const response = await fetch('https://pokemon-backend-rj8e.onrender.com/upload', {
            method: 'POST',
            body: formData,
        });

        const result = await response.json();

        if (response.ok) {
            uploadStatus.textContent = `Upload successful! Video available at: ${result.videoUrl}`;
            loadUploadedVideos(); // Reload the video gallery
        } else {
            uploadStatus.textContent = `Error: ${result.message}`;
        }
    } catch (error) {
        uploadStatus.textContent = `Upload failed: ${error.message}`;
    }
});

// Generate thumbnail from the first frame of the video
async function generateThumbnail(videoFile) {
    const videoElement = document.createElement('video');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Load the video file into the video element
    const videoUrl = URL.createObjectURL(videoFile);
    videoElement.src = videoUrl;

    return new Promise((resolve, reject) => {
        videoElement.addEventListener('loadeddata', () => {
            videoElement.currentTime = 0; // Seek to the first frame
        });

        videoElement.addEventListener('seeked', () => {
            // Draw the first frame onto the canvas
            canvas.width = videoElement.videoWidth;
            canvas.height = videoElement.videoHeight;
            ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
            const dataUrl = canvas.toDataURL('image/jpeg');
            resolve(dataUrl); // Return the thumbnail image as a base64 string
        });

        videoElement.addEventListener('error', (err) => {
            reject('Error generating thumbnail: ' + err);
        });
    });
}

// Fetch and display uploaded videos
async function loadUploadedVideos() {
    try {
        const response = await fetch('https://pokemon-backend-rj8e.onrender.com/videos');
        const videos = await response.json();

        // Clear existing videos
        videoGrid.innerHTML = '';

        if (videos.length === 0) {
            videoGrid.innerHTML = '<p>No videos available.</p>';
        } else {
            // Loop through videos and create thumbnail elements
            videos.forEach((video) => {
                const videoDiv = document.createElement('div');
                videoDiv.classList.add('video-thumbnail');

                videoDiv.innerHTML = `
                    <img src="${video.thumbnailUrl}" alt="Thumbnail" class="thumbnail">
                    <div class="title">${video.videoName}</div>
                `;

                // Set the onclick handler to play the selected video
                videoDiv.onclick = () => playVideo(video.videoUrl);
                videoGrid.appendChild(videoDiv);
            });
        }
    } catch (error) {
        console.error('Error loading videos:', error);
    }
}

// Play selected video in the video player
function playVideo(videoUrl) {
    videoSource.src = `https://pokemon-backend-rj8e.onrender.com${videoUrl}`;
    videoPlayer.load();
    videoPlayer.play();
}

// Load uploaded videos when the page loads
window.onload = loadUploadedVideos;
