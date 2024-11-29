const uploadForm = document.getElementById('uploadForm');
const videoFileInput = document.getElementById('videoFile');
const uploadStatus = document.getElementById('uploadStatus');
const videoGrid = document.getElementById('videoGrid');
const videoPlayer = document.getElementById('videoPlayer');
const videoSource = document.getElementById('videoSource');

// Upload video
uploadForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const file = videoFileInput.files[0];
    if (!file) {
        uploadStatus.textContent = 'Please select a video file.';
        return;
    }

    const formData = new FormData();
    formData.append('video', file);

    try {
        uploadStatus.textContent = 'Uploading...';
        const response = await fetch('https://your-backend-url.onrender.com/upload', {
            method: 'POST',
            body: formData,
        });

        const result = await response.json();
        if (response.ok) {
            uploadStatus.textContent = 'Upload successful!';
            loadVideos(); // Refresh gallery
        } else {
            uploadStatus.textContent = `Error: ${result.message}`;
        }
    } catch (error) {
        uploadStatus.textContent = `Upload failed: ${error.message}`;
    }
});

// Load videos
async function loadVideos() {
    try {
        const response = await fetch('https://your-backend-url.onrender.com/videos');
        const videos = await response.json();
        videoGrid.innerHTML = ''; // Clear existing videos

        if (videos.length === 0) {
            videoGrid.innerHTML = '<p>No videos available.</p>';
        } else {
            videos.forEach((video) => {
                const videoDiv = document.createElement('div');
                videoDiv.classList.add('video-thumbnail');
                videoDiv.innerHTML = `
                    <video width="200" controls>
                        <source src="${video.url}" type="video/mp4">
                        Your browser does not support the video tag.
                    </video>
                `;
                videoDiv.onclick = () => playVideo(video.url);
                videoGrid.appendChild(videoDiv);
            });
        }
    } catch (error) {
        console.error('Error loading videos:', error);
    }
}

// Play video
function playVideo(url) {
    videoSource.src = url;
    videoPlayer.load();
    videoPlayer.play();
}

// Load videos on page load
window.onload = loadVideos;
