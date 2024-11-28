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

        videoGrid.innerHTML = ''; // Clear existing videos
        videos.forEach((video) => {
            const videoDiv = document.createElement('div');
            videoDiv.classList.add('video-thumbnail');
            videoDiv.innerHTML = `
                <img src="https://via.placeholder.com/150" alt="Thumbnail">
                <div class="title">${video.title}</div>
            `;
            videoDiv.onclick = () => playVideo(video.url);
            videoGrid.appendChild(videoDiv);
        });
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
