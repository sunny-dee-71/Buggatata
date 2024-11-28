// Example script for loading videos (you will need a backend for actual uploads)
const backendURL = "https://your-backend-url";  // Replace with your backend URL

// Handle video upload (if you have a backend)
document.getElementById('upload-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData();
    const fileInput = document.getElementById('video-upload');
    formData.append('video', fileInput.files[0]);

    const status = document.getElementById('upload-status');
    status.textContent = "Uploading...";

    try {
        const response = await fetch(`${backendURL}/upload`, {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            status.textContent = "Upload successful!";
            loadVideoGrid();  // Reload the list of available videos
        } else {
            status.textContent = "Upload failed. Try again.";
        }
    } catch (error) {
        console.error('Error uploading video:', error);
        status.textContent = "Error uploading video.";
    }
});

// Function to load video grid (this can be dynamic or static for now)
async function loadVideoGrid() {
    const videoGridElement = document.getElementById('video-grid');
    videoGridElement.innerHTML = '';  // Clear existing content

    try {
        const response = await fetch(`${backendURL}/videos`);
        const videos = await response.json();

        if (videos.length > 0) {
            videos.forEach(video => {
                const videoElement = document.createElement('div');
                videoElement.classList.add('video-thumbnail');
                videoElement.innerHTML = `
                    <img src="https://via.placeholder.com/150" alt="Thumbnail">
                    <div class="title">${video}</div>
                    <button onclick="playVideo('${video}')">Play</button>
                `;
                videoGridElement.appendChild(videoElement);
            });
        }
    } catch (error) {
        console.error('Error loading video grid:', error);
    }
}

// Play selected video
function playVideo(videoName) {
    const videoPlayer = document.getElementById('current-video');
    videoPlayer.src = `${backendURL}/videos/${videoName}`;
    document.getElementById('video-title').textContent = videoName;
}

// Initial load of video grid (or you can dynamically populate if connected to a backend)
loadVideoGrid();
