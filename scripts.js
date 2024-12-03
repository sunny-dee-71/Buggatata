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
// Load videos into the gallery
async function loadVideos() {
  try {
    const response = await fetch('https://pokemon-backend-rj8e.onrender.com/videos');
    const videos = await response.json();

    videoGrid.innerHTML = ''; // Clear current gallery
    if (videos.length === 0) {
      videoGrid.innerHTML = '<p>No videos uploaded yet.</p>';
    } else {
      videos.forEach((video) => {
        const videoElement = document.createElement('div');
        videoElement.className = 'video-thumbnail';
        videoElement.innerHTML = `
          <video muted>
            <source src="${video.url}" type="video/mp4">
            Your browser does not support the video tag.
          </video>
          <p>${video.name}</p>
        `;
        videoElement.addEventListener('click', () => playVideo(video.url));
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

// Function to upload the wake file
// Function to upload the wake file
async function uploadWakeFile() {
  // Create a FormData object
  const formData = new FormData();

  // Create a new Blob to simulate a file (this is our "wake" file)
  const wakeFile = new Blob(["Wake up!"], { type: 'text/plain' });

  // Append the wake file to FormData
  formData.append('video', wakeFile, 'wake.txt');
  formData.append('videoName', 'wake');

  // Send the formData (the wake file) to the server
  try {
    const response = await fetch('https://pokemon-backend-rj8e.onrender.com/upload', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const result = await response.json();
      console.log('Wake file uploaded successfully:', result.message);
    } else {
      const errorResult = await response.json();
      console.log('Error uploading wake file:', errorResult.error);
    }
  } catch (error) {
    console.error('Error uploading wake file:', error.message);
  }
}


// Load videos on page load
window.onload = async () => {
  // Upload the wake file to keep the server awake
  await uploadWakeFile();

  // Load the video gallery after uploading the wake file
  loadVideos();
};
