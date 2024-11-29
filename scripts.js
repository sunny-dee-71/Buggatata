// Select elements
const videoPlayer = document.getElementById('videoPlayer');
const videoSource = document.getElementById('videoSource');
const videoGrid = document.getElementById('videoGrid');

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

                videoDiv.innerHTML = `
                    <video src="https://pokemon-backend-rj8e.onrender.com${videoUrl}" muted></video>
                    <div class="title">${videoUrl.split('/').pop()}</div>
                `;

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