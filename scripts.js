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

// Search functionality (if implemented later)
document.querySelector('.search-bar input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const query = e.target.value;
        alert(`Searching for: ${query}`);
    }
});
