// Function to load the videos
function loadVideos() {
    fetch('https://pokemon-backend-rj8e.onrender.com/videos')
        .then(response => response.json())
        .then(videos => {
            const videoGallery = document.getElementById('videoGallery');
            videoGallery.innerHTML = '';  // Clear previous gallery

            videos.forEach(video => {
                const videoUrl = video.url;
                const thumbnailUrl = video.thumbnail_url; // Ensure Cloudinary provides this URL
                
                const videoThumbnail = document.createElement('img');
                videoThumbnail.src = thumbnailUrl; // Set the thumbnail image
                videoThumbnail.alt = "Video Thumbnail";
                videoThumbnail.classList.add('thumbnail');
                
                // Add click event to play the video when clicked
                videoThumbnail.addEventListener('click', () => {
                    playVideo(videoUrl);
                });

                // Append the thumbnail to the gallery
                videoGallery.appendChild(videoThumbnail);
            });
        })
        .catch(error => {
            console.error('Error loading videos:', error);
        });
}

// Function to play the video in the main player
function playVideo(videoUrl) {
    const videoPlayer = document.getElementById('videoPlayer');
    const videoSource = document.getElementById('videoSource');
    
    if (videoPlayer && videoSource) {
        videoSource.src = videoUrl;
        videoPlayer.load();  // Refresh the video element to load the new source
        videoPlayer.play();
    } else {
        console.error('Video player or source element not found');
    }
}

// Call loadVideos on page load
window.onload = loadVideos;
