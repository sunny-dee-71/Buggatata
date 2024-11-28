// Select elements
const uploadForm = document.getElementById('uploadForm');
const videoFileInput = document.getElementById('videoFile');
const videoNameInput = document.getElementById('videoName');
const uploadStatus = document.getElementById('uploadStatus');
const videoPlayer = document.getElementById('videoPlayer');
const videoSource = document.getElementById('videoSource');
const videoGrid = document.getElementById('videoGrid');

// Handle video upload
uploadForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the form from submitting normally

    const file = videoFileInput.files[0];
    const videoName = videoNameInput.value.trim();

    if (!file || !videoName) {
        uploadStatus.textContent = 'Please select a video file and enter a video name.';
        return;
    }

    const formData = new FormData();
    formData.append('video', file); // Attach video file to form data
    formData.append('video-name', videoName); // Attach video name to form data

    // Generate a thumbnail (optional step: here we are just sending a placeholder)
    const thumbnail = await generateThumbnail(file);
    formData.append('thumbnail', thumbnail);

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

// Function to generate a thumbnail (this is a placeholder for now)
async function generateThumbnail(file) {
    // You can implement real thumbnail generation here if needed, for now it's just a placeholder
    // For example, you could use a video element to extract the first frame or use a server-side library
    return 'https://via.placeholder.com/150';  // Placeholder thumbnail URL
}

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
            videos.forEach((video) => {
                const videoDiv = document.createElement('div');
                videoDiv.classList.add('video-thumbnail');

                videoDiv.innerHTML = `
                    <img src="${video.thumbnailUrl}" alt="Thumbnail" class="thumbnail">
                    <div class="title">${video.videoName}</div>
                `;

                // Set the onclick handler to play the selected video
                videoDiv.onclick = () => playVideo(video.videoUrl);
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
