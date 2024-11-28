// Select elements
const uploadForm = document.getElementById('uploadForm');
const videoFileInput = document.getElementById('videoFile');
const uploadStatus = document.getElementById('uploadStatus');
const videoPlayer = document.getElementById('videoPlayer');
const videoSource = document.getElementById('videoSource');
const videoGrid = document.getElementById('videoGrid');

// Function to generate thumbnail
function generateThumbnail(videoFile) {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    video.src = URL.createObjectURL(videoFile);
    video.load();

    return new Promise((resolve, reject) => {
        video.onloadeddata = () => {
            // Set canvas size to match video size
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            // Draw the first frame of the video on the canvas
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            // Convert the canvas to a data URL (image)
            const thumbnailDataUrl = canvas.toDataURL('image/png');

            resolve(thumbnailDataUrl);
        };

        video.onerror = (error) => reject(error);
    });
}

// Handle video upload
uploadForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the form from submitting normally

    const file = videoFileInput.files[0];
    if (!file) {
        uploadStatus.textContent = 'Please select a video file to upload.';
        return;
    }

    const formData = new FormData();
    formData.append('video', file); // Attach video file to form data

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
            videos.forEach((videoUrl) => {
                const videoDiv = document.createElement('div');
                videoDiv.classList.add('video-thumbnail');

                // Generate a thumbnail for each video
                generateThumbnail(videoUrl).then((thumbnail) => {
                    videoDiv.innerHTML = `
                        <img src="${thumbnail}" alt="Thumbnail" class="thumbnail">
                        <div class="title">${videoUrl}</div>
                    `;
                }).catch(error => {
                    console.error('Error generating thumbnail:', error);
                    videoDiv.innerHTML = `
                        <img src="https://via.placeholder.com/150" alt="Thumbnail" class="thumbnail">
                        <div class="title">${videoUrl}</div>
                    `;
                });

                // Set the onclick handler to play the selected video
                videoDiv.onclick = () => playVideo(videoUrl);
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
