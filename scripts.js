// Placeholder videos for the grid (you can replace these with real data)
const videoData = [
    { title: 'Video 1', thumbnail: 'assets/thumbnail1.jpg', videoUrl: 'https://your-backend-url/videos/video1.mp4' },
    { title: 'Video 2', thumbnail: 'assets/thumbnail2.jpg', videoUrl: 'https://your-backend-url/videos/video2.mp4' }
];

// Load video thumbnails into the grid
const videoGrid = document.getElementById('video-grid');
videoData.forEach((video) => {
    const videoDiv = document.createElement('div');
    videoDiv.classList.add('video-thumbnail');
    videoDiv.innerHTML = `
        <img src="${video.thumbnail}" alt="${video.title}">
        <div class="title">${video.title}</div>
    `;
    videoDiv.onclick = () => loadVideo(video);
    videoGrid.appendChild(videoDiv);
});

// Load the selected video into the player
function loadVideo(video) {
    const videoPlayer = document.getElementById('video-player');
    const videoTitle = document.getElementById('video-title');
    const videoSource = document.getElementById('video-source');

    videoSource.src = video.videoUrl;
    videoPlayer.load();
    videoTitle.textContent = video.title;
}

function playVideo() {
    const videoPlayer = document.getElementById('video-player');
    videoPlayer.play();
}

function shareVideo() {
    alert('Sharing feature coming soon!');
}

function favoriteVideo() {
    alert('Favorite feature coming soon!');
}
