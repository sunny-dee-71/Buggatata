const backendURL = "https://Pokemon-Node.onrender.com";  // Use your Render URL

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
        } else {
            status.textContent = "Upload failed. Try again.";
        }
    } catch (error) {
        console.error('Error uploading video:', error);
        status.textContent = "Error uploading video.";
    }
});
