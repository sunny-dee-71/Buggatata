// Play video functionality
function playVideo() {
    alert("Playing the video!");
}

// Share video functionality
function shareVideo() {
    alert("Video link copied to clipboard!");
}

// Favorite video functionality
function favoriteVideo() {
    alert("Video added to favorites!");
}

// Handle video upload
document.getElementById('upload-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData();
    const fileInput = document.getElementById('video-upload');

    formData.append('video', fileInput.files[0]);

    const status = document.getElementById('upload-status');
    status.textContent = "Uploading...";

    try {
        const response = await fetch('http://localhost:3000/upload', {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            status.textContent = "Upload successful!";
        } else {
            status.textContent = "Upload failed. Try again.";
        }
    } catch (error) {
        console.error('Error uploading video:', error);
        status.textContent = "Error uploading video.";
    }
});
