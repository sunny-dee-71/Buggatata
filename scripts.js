const uploadForm = document.getElementById('uploadForm');
const videoFileInput = document.getElementById('videoFile');
const videoNameInput = document.getElementById('videoName');
const uploadStatus = document.getElementById('uploadStatus');
const videoGrid = document.getElementById('videoGrid');
const mainVideoPlayer = document.getElementById('mainVideoPlayer');
const mainVideoSource = document.getElementById('mainVideoSource');

// Handle video upload
uploadForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const file = videoFileInput.files[0];
  const videoName = videoNameInput.value;

  if (!file) {
    uploadStatus.textContent = 'Please select a video file to upload.';
    return;
  }

  const formData = new FormData();
  formData.append('video', file);
  formData.append('videoName', videoName);

  try {
    uploadStatus.textContent = 'Uploading...';
    const response = await fetch('https://pokemon-backend-rj8e.onrender.com/upload', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();

    if (response.ok) {
      uploadStatus.textContent = `Upload successful!`;
      loadVideos(); // Reload the gallery
    } else {
      uploadStatus.textContent = `Error: ${result.error}`;
    }
  } catch (error) {
    uploadStatus.textContent = `Upload failed: ${error.message}`;
  }
});

// Load videos into the gallery
async function loadVideos() {
  try {
    const response = await fetch('https://pokemon-backend-rj8e.onrender.com/videos');
    const videos = await response.json();

    videoGrid.innerHTML = ''; // Clear current gallery
    if (videos.length === 0) {
      videoGrid.innerHTML = '<p>No videos uploaded yet.</p>';
    } else {
      videos.forEach((videoUrl) => {
        const videoElement = document.createElement('div');
        videoElement.className = 'video-thumbnail';
        videoElement.innerHTML = `
          <video muted>
            <source src="${videoUrl}" type="video/mp4">
            Your browser does not support the video tag.
          </video>
        `;
        videoElement.addEventListener('click', () => playVideo(videoUrl));
        videoGrid.appendChild(videoElement);
      });
    }
  } catch (error) {
    console.error('Error loading videos:', error);
  }
}

// Play selected video in the main video player
function playVideo(videoUrl) {
  mainVideoSource.src = videoUrl;
  mainVideoPlayer.load();
  mainVideoPlayer.play();
}

// wakes the server
window.onload = () => {
  // Create a FormData object
  const formData = new FormData();

  // Create a new Blob to simulate a file
  const wakeFile = new Blob(["Wake up!"], { type: 'text/plain' });
  formData.append('wake', wakeFile, 'wake.txt');

  // Send the formData (the wake file) to the server
  fetch('https://pokemon-backend-rj8e.onrender.com/wake', {
    method: 'POST',
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data.message); // Log success message
    })
    .catch((error) => {
      console.error('Error uploading wake file:', error);
    });

  // Load the videos after uploading the wake file
  loadVideos();
};
