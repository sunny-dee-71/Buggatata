// Select elements
const uploadForm = document.getElementById('uploadForm');
const videoTitleInput = document.getElementById('videoTitle'); // Video title input
const videoFileInput = document.getElementById('videoFile');
const uploadStatus = document.getElementById('uploadStatus');

// Handle video upload
uploadForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the form from submitting normally

    const file = videoFileInput.files[0];
    const title = videoTitleInput.value.trim(); // Get the entered title
    if (!file) {
        uploadStatus.textContent = 'Please select a video file to upload.';
        return;
    }
    if (!title) {
        uploadStatus.textContent = 'Please enter a title for the video.';
        return;
    }

    const formData = new FormData();
    formData.append('video', file); // Attach the video file
    formData.append('title', title); // Add the video title

    try {
        uploadStatus.textContent = 'Uploading...';

        const response = await fetch('https://pokemon-backend-rj8e.onrender.com/upload', {
            method: 'POST',
            body: formData,
        });

        const result = await response.json();

        if (response.ok) {
            uploadStatus.textContent = `Upload successful! Video available at: ${result.url}`;
            loadUploadedVideos(); // Reload the video gallery
        } else {
            uploadStatus.textContent = `Error: ${result.message}`;
        }
    } catch (error) {
        uploadStatus.textContent = `Upload failed: ${error.message}`;
    }
});

// Function to load uploaded videos
async function loadUploadedVideos() {
    try {
        const response = await fetch('https://pokemon-backend-rj8e.onrender.com/videos');
        const videos = await response.json();

        // Clear existing videos
        const videoGrid = document.getElementById('videoGrid');
        videoGrid.innerHTML = '';

        if (videos.length === 0) {
            videoGrid.innerHTML = '<p>No videos available.</p>';
        } else {
            // Loop through videos and create thumbnail elements
            videos.forEach((video) => {
                const videoDiv = document.createElement('div');
                videoDiv.classList.add('video-thumbnail');

                videoDiv.innerHTML = `
                    <div class="title">${video.title}</div>
                    <video width="150" height="auto" controls>
                        <source src="${video.url}" type="video/mp4">
                        Your browser does not support the video tag.
                    </video>
                `;

                // Set the onclick handler to play the selected video
                videoDiv.onclick = () => playVideo(video.url);
                videoGrid.appendChild(videoDiv);
            });
        }
    } catch (error) {
        console.error('Error loading videos:', error);
    }
}

// Play selected video in the video player
function playVideo(videoUrl) {
    const videoPlayer = document.getElementById('videoPlayer');
    const videoSource = document.getElementById('videoSource');
    videoSource.src = videoUrl;
    videoPlayer.load();
    videoPlayer.play();
}

// Load uploaded videos when the page loads
window.onload = loadUploadedVideos;