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

        if (!response.ok) {
            throw new Error(`Server responded with ${response.status}`);
        }

        const result = await response.json();

        uploadStatus.textContent = 'Upload successful!';
        loadUploadedVideos(); // Reload the video gallery
    } catch (error) {
        console.error('Error uploading video:', error);
        uploadStatus.textContent = `Upload failed: ${error.message}`;
    }
});

// Fetch and display uploaded videos
async function loadUploadedVideos() {
    try {
        const response = await fetch('https://pokemon-backend-rj8e.onrender.com/videos');

        if (!response.ok) {
            throw new Error(`Server responded with ${response.status}`);
        }

        const videos = await response.json();

        // Clear existing videos
        videoGrid.innerHTML = '';

        if (videos.length === 0) {
            videoGrid.innerHTML = '<p>No videos available.</p>';
        } else {
            // Loop through videos and create thumbnail elements
            videos.forEach((video) => {
                const videoDiv = document.createElement('div');
                videoDiv.classList.add('video-thumbnail');

                videoDiv.innerHTML = `
                    <video class="thumbnail" controls>
                        <source src="${video.url}" type="video/mp4">
                        Your browser does not support the video tag.
                    </video>
                    <p>${video.name || 'Untitled Video'}</p>
                `;

                // Set the onclick handler to play the selected video
                videoDiv.onclick = () => playVideo(video.url);
                videoGrid.appendChild(videoDiv);
            });
        }
    } catch (error) {
        console.error('Error loading videos:', error);
        videoGrid.innerHTML = `<p>Error loading videos: ${error.message}</p>`;
    }
}

// Play selected video in the video player
function playVideo(videoUrl) {
    videoSource.src = videoUrl;
    videoPlayer.load();
    videoPlayer.play();
}

// Load uploaded videos when the page loads
window.onload = loadUploadedVideos;