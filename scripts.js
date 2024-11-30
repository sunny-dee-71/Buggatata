const uploadForm = document.getElementById('uploadForm');
const videoFileInput = document.getElementById('videoFile');
const uploadStatus = document.getElementById('uploadStatus');
const videoPlayer = document.getElementById('videoPlayer');
const videoSource = document.getElementById('videoSource');
const videoGrid = document.getElementById('videoGrid');

// Handle video upload
uploadForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const file = videoFileInput.files[0];
    if (!file) {
        uploadStatus.textContent = 'Please select a video file to upload.';
        return;
    }

    const formData = new FormData();
    formData.append('video', file);

    try {
        uploadStatus.textContent = 'Uploading...';

        const response = await fetch('https://pokemon-backend-rj8e.onrender.com/upload', {
            method: 'POST',
            body: formData,
        });

        const result = await response.json();

        if (response.ok) {
            uploadStatus.textContent = `Upload successful! Video URL: ${result.videoUrl}`;
            loadUploadedVideos();
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
            videos.forEach((video) => {
                const videoDiv = document.createElement('div');
                videoDiv.classList.add('video-thumbnail');

                videoDiv.innerHTML = `
                    <img src="${video.thumbnailUrl}" alt="Thumbnail" class="thumbnail">
                    <p>${video.videoUrl.split('/').pop()}</p>
                `;

                videoDiv.onclick = () => playVideo(video.videoUrl);
                videoGrid.appendChild(videoDiv);
            });
        }
    } catch (error) {
        console.error('Error loading videos:', error);
    }
}

// Load videos when the page loads
window.onload = loadUploadedVideos;