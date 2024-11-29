// Select elements
const uploadForm = document.getElementById('uploadForm');
const videoFileInput = document.getElementById('videoFile');
const uploadStatus = document.getElementById('uploadStatus');
const videoPlayer = document.getElementById('videoPlayer');
const videoSource = document.getElementById('videoSource');
const videoGrid = document.getElementById('videoGrid');

// Handle video upload
uploadForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the form from submitting normally

    const file = videoFileInput.files[0];
    if (!file) {
        uploadStatus.textContent = 'Please select a video file to upload.';
        uploadStatus.style.color = 'red';
        return;
    }

    const formData = new FormData();
    formData.append('video', file);

    try {
        uploadStatus.textContent = 'Uploading...';
        uploadStatus.style.color = 'blue';

        const response = await fetch('https://pokemon-backend-rj8e.onrender.com/upload', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorResult = await response.json();
            throw new Error(errorResult.message || 'Failed to upload video');
        }

        const result = await response.json();
        uploadStatus.textContent = 'Upload successful!';
        uploadStatus.style.color = 'green';
        loadUploadedVideos(); // Refresh the gallery
    } catch (error) {
        console.error('Upload error:', error);
        uploadStatus.textContent = `Upload failed: ${error.message}`;
        uploadStatus.style.color = 'red';
    }
});

// Fetch and display uploaded videos
async function loadUploadedVideos() {
    try {
        const response = await fetch('https://pokemon-backend-rj8e.onrender.com/videos');
        if (!response.ok) throw new Error('Failed to fetch videos');

        const videos = await response.json();

        // Clear existing videos
        videoGrid.innerHTML = '';

        if (videos.length === 0) {
            videoGrid.innerHTML = '<p>No videos available.</p>';
        } else {
            videos.forEach((videoUrl) => {
                const videoDiv = document.createElement('div');
                videoDiv.classList.add('video-thumbnail');

                videoDiv.innerHTML = `
                    <video src="https://pokemon-backend-rj8e.onrender.com${videoUrl}" muted></video>
                    <div class="title">${videoUrl.split('/').pop()}</div>
                `;

                videoDiv.onclick = () => playVideo(videoUrl);
                videoGrid.appendChild(videoDiv);
            });
        }
    } catch (error) {
        console.error('Error loading videos:', error);
        videoGrid.innerHTML = '<p>Error loading videos. Please try again later.</p>';
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