// Example script for uploading and displaying videos
const backendURL = "https://pokemon-node.onrender.com";  // Update with your backend URL (Render or localhost)

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

// Load uploaded videos from the backend and display them
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
                    <video width="150" controls>
                        <source src="${backendURL}/uploads/${video}" type="video/mp4">
                        Your browser does not support the video tag.
                    </video>
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

// Function to play the selected video
function playVideo(videoName) {
    const videoPlayer = document.getElementById('current-video');
    videoPlayer.src = `${backendURL}/uploads/${videoName}`;
    document.getElementById('video-title').textContent = videoName;
}

// Initial load of the video grid
loadVideoGrid();
