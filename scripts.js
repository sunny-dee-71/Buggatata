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
            uploadStatus.textContent = 'Upload successful!';
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
        const videoUrls = await response.json();

        videoGrid.innerHTML = '';

        if (videoUrls.length === 0) {
            videoGrid.innerHTML = '<p>No videos available.</p>';
            return;
        }

        videoUrls.forEach((url) => {
            const videoDiv = document.createElement('div');
            videoDiv.classList.add('video-thumbnail');
            videoDiv.innerHTML = `
                <video src="${url}" controls></video>
            `;
            videoDiv.onclick = () => playVideo(url);
            videoGrid.appendChild(videoDiv);
        });
    } catch (error) {
        console.error('Error loading videos:', error);
    }
}

// Play selected video
function playVideo(videoUrl) {
    videoSource.src = videoUrl;
    videoPlayer.load();
    videoPlayer.play();
}

// Load videos on page load
window.onload = loadUploadedVideos;