// Select elements
const uploadForm = document.getElementById('uploadForm');
const videoFileInput = document.getElementById('videoFile');
const videoNameInput = document.getElementById('videoName');
const uploadStatus = document.getElementById('uploadStatus');
const videoPlayer = document.getElementById('videoPlayer');
const videoSource = document.getElementById('videoSource');
const videoGrid = document.getElementById('videoGrid');

// Upload Video
uploadForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const file = videoFileInput.files[0];
    const name = videoNameInput.value.trim() || file.name.split('.').slice(0, -1).join('.');

    if (!file) {
        uploadStatus.textContent = 'Please select a video file to upload.';
        return;
    }

    const formData = new FormData();
    formData.append('video', file);
    formData.append('name', name);

    try {
        uploadStatus.textContent = 'Uploading...';

        const response = await fetch('https://pokemon-backend-rj8e.onrender.com/upload', {
            method: 'POST',
            body: formData,
        });

        const result = await response.json();

        if (response.ok) {
            uploadStatus.textContent = `Upload successful! Video URL: ${result.url}`;
            loadUploadedVideos();
        } else {
            uploadStatus.textContent = `Error: ${result.error}`;
        }
    } catch (error) {
        uploadStatus.textContent = `Upload failed: ${error.message}`;
    }
});

// Fetch and Display Uploaded Videos
async function loadUploadedVideos() {
    try {
        const response = await fetch('https://pokemon-backend-rj8e.onrender.com/videos');
        if (!response.ok) throw new Error(`Server responded with ${response.status}`);
        const videos = await response.json();

        videoGrid.innerHTML = '';
        videos.forEach((video) => {
            const videoDiv = document.createElement('div');
            videoDiv.classList.add('video-thumbnail');

            videoDiv.innerHTML = `
                <video muted>
                    <source src="${video.url}" type="video/mp4">
                    Your browser does not support the video tag.
                </video>
                <p>${video.name}</p>
            `;

            videoDiv.addEventListener('click', () => playVideo(video.url));
            videoGrid.appendChild(videoDiv);
        });
    } catch (error) {
        console.error('Error loading videos:', error);
    }
}

// Play Video
function playVideo(videoUrl) {
    videoSource.src = videoUrl;
    videoPlayer.load();
    videoPlayer.play();
}

// Load videos on page load
window.onload = loadUploadedVideos;
