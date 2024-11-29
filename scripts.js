const uploadForm = document.getElementById('uploadForm');
const videoFileInput = document.getElementById('videoFile');
const uploadStatus = document.getElementById('uploadStatus');
const videoGrid = document.getElementById('videoGrid');

const BACKEND_URL = 'https://pokemon-backend-rj8e.onrender.com';

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

        const response = await fetch(`${BACKEND_URL}/upload`, {
            method: 'POST',
            body: formData
        });

        const result = await response.json();
        if (response.ok) {
            uploadStatus.textContent = `Upload successful!`;
            loadUploadedVideos();
        } else {
            uploadStatus.textContent = `Error: ${result.message}`;
        }
    } catch (error) {
        uploadStatus.textContent = `Upload failed: ${error.message}`;
    }
});

// Load uploaded videos
async function loadUploadedVideos() {
    try {
        const response = await fetch(`${BACKEND_URL}/videos`);
        const videos = await response.json();

        videoGrid.innerHTML = '';
        if (videos.length === 0) {
            videoGrid.innerHTML = '<p>No videos uploaded yet.</p>';
        } else {
            videos.forEach(videoUrl => {
                const videoDiv = document.createElement('div');
                videoDiv.classList.add('video-thumbnail');
                videoDiv.innerHTML = `
                    <video src="${BACKEND_URL}${videoUrl}" controls></video>
                `;
                videoGrid.appendChild(videoDiv);
            });
        }
    } catch (error) {
        console.error('Error loading videos:', error);
    }
}

// Load videos on page load
window.onload = loadUploadedVideos;