
const albums = [
  {
    id: 1,
    title: "SLXMER",
    artist: "Prod. Spade",
    cover: "slxmercover.jpg",
    tracks: [
      { name: "IDKK", duration: 180, src: "slxmer-songs/IDKK.m4a" },
      { name: "KILLERS", duration: 180, src: "slxmer-songs/KILLERS.m4a" },
      { name: "Olympics", duration: 180, src: "slxmer-songs/Olympics.m4a" },
      { name: "Private", duration: 180, src: "slxmer-songs/Private.m4a" },
      { name: "SUMMORE", duration: 180, src: "slxmer-songs/SUMMORE.m4a" },
      { name: "TALKIN", duration: 180, src: "slxmer-songs/TALKIN.m4a" }
    ]
  },
  {
    id: 2,
    title: "SLXME SEASON",
    artist: "Prod. Spade",
    cover: "slxmeseasoncover.png",
    tracks: [
      { name: "KILLERS", duration: 180, src: "slxme-season-songs/KILLERS.m4a" },
      { name: "Private", duration: 180, src: "slxme-season-songs/Private.m4a" },
      { name: "SUMMORE", duration: 180, src: "slxme-season-songs/SUMMORE.m4a" },
      { name: "TALKIN", duration: 180, src: "slxme-season-songs/TALKIN.m4a" }
    ]
  },
  {
    id: 3,
    title: "SPXDE",
    artist: "Prod. Spade",
    cover: "spxdecover.png",
    tracks: [
      { name: "2X", duration: 180, src: "spxde-songs/2X.m4a" },
      { name: "AFF0RD", duration: 180, src: "spxde-songs/AFF0RD.m4a" },
      { name: "BLXCKFIT", duration: 180, src: "spxde-songs/BLXCKFIT.m4a" },
      { name: "CHRXME", duration: 180, src: "spxde-songs/CHRXME.m4a" },
      { name: "GETIT", duration: 180, src: "spxde-songs/GETIT.m4a" },
      { name: "Listen2Me", duration: 180, src: "spxde-songs/Listen2Me.m4a" },
      { name: "SCKO", duration: 180, src: "spxde-songs/SCKO.m4a" },
      { name: "WutIGot", duration: 180, src: "spxde-songs/WutIGot.m4a" }
    ]
  },
  {
    id: 4,
    title: "AFFORD WUT",
    artist: "Prod. Spade",
    cover: "affordwutcover.png",
    tracks: [
      { name: "AFF0RD", duration: 180, src: "affordwut-songs/AFF0RD.m4a" },
      { name: "GETIT", duration: 180, src: "affordwut-songs/GETIT.m4a" },
      { name: "Listen2Me", duration: 180, src: "affordwut-songs/Listen2Me.m4a" },
      { name: "WutIGot", duration: 180, src: "affordwut-songs/WutIGot.m4a" }
    ]
  }
];

let currentAlbum = null;
let currentTrackIndex = 0;
let isPlaying = false;
let isLooping = false;
let isShuffling = false;
let audioPlayer = new Audio();
let shuffledIndices = [];

audioPlayer.addEventListener('ended', () => {
  nextTrack();
});

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

audioPlayer.addEventListener('timeupdate', () => {
  const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
  document.querySelector('.progress').style.width = `${progress}%`;
  document.getElementById('current-time').textContent = formatTime(audioPlayer.currentTime);
  document.getElementById('total-time').textContent = formatTime(audioPlayer.duration);
});

let isDragging = false;

document.querySelector('.progress-bar').addEventListener('mousedown', (e) => {
  isDragging = true;
  updateProgressBar(e);
});

document.addEventListener('mousemove', (e) => {
  if (isDragging) {
    updateProgressBar(e);
  }
});

document.addEventListener('mouseup', () => {
  isDragging = false;
});

function updateProgressBar(e) {
  const progressBar = document.querySelector('.progress-bar');
  const clickPosition = e.clientX - progressBar.getBoundingClientRect().left;
  const progressBarWidth = progressBar.offsetWidth;
  const percentage = Math.min(Math.max(clickPosition / progressBarWidth, 0), 1);
  
  if (!isNaN(audioPlayer.duration)) {
    audioPlayer.currentTime = percentage * audioPlayer.duration;
  }
}

function renderAlbums() {
  const albumsContainer = document.querySelector('.albums');
  albums.forEach(album => {
    const albumElement = document.createElement('div');
    albumElement.className = 'album';
    albumElement.innerHTML = `
      <div class="album-info">
        <img src="${album.cover}" alt="${album.title}">
        <div>
          <h3>${album.title} <span class="explicit-badge">E</span></h3>
          <p>${album.artist}</p>
        </div>
      </div>
    `;

    albumElement.addEventListener('click', () => selectAlbum(album));
    albumsContainer.appendChild(albumElement);
  });
  
  // Auto-select the first album if there are any albums
  if (albums.length > 0) {
    selectAlbum(albums[0]);
  }
}

function selectAlbum(album) {
  currentAlbum = album;
  currentTrackIndex = null;
  isPlaying = false;
  audioPlayer.src = '';
  
  const tracksContainer = document.getElementById('tracks-container');
  tracksContainer.innerHTML = album.tracks.map((track, index) => `
    <div class="track" data-index="${index}">
      <span>${track.name} <span class="explicit-badge">E</span></span>
    </div>
  `).join('');

  // Set initial album details
  document.getElementById('track-name').innerHTML = `${album.title}`;
  document.getElementById('artist-name').textContent = 'Prod. Spade';
  document.getElementById('album-art').src = album.cover;
  document.getElementById('mini-art').src = album.cover;
  
  tracksContainer.querySelectorAll('.track').forEach(track => {
    track.addEventListener('click', () => {
      currentTrackIndex = parseInt(track.dataset.index);
      isPlaying = true;
      loadAndPlayTrack();
    });
  });
  document.querySelectorAll('.album').forEach(el => {
    el.classList.remove('active');
    if (el.querySelector('h3').textContent === album.title) {
      el.classList.add('active');
    }
  });
}

function loadAndPlayTrack() {
  if (!currentAlbum) return;
  
  const track = currentTrackIndex !== null ? currentAlbum.tracks[currentTrackIndex] : null;
  if (track) {
    audioPlayer.src = track.src;
  }
  updatePlayerUI();
  if (isPlaying) {
    audioPlayer.play();
  }
}

function updatePlayerUI() {
  if (!currentAlbum) return;
  
  document.getElementById('album-art').src = currentAlbum.cover;
  document.getElementById('mini-art').src = currentAlbum.cover;
  document.getElementById('artist-name').textContent = currentAlbum.artist;
  document.getElementById('mini-artist-name').textContent = currentAlbum.artist;

  if (currentTrackIndex !== null) {
    const track = currentAlbum.tracks[currentTrackIndex];
    document.getElementById('track-name').innerHTML = `${track.name} <span class="explicit-badge">E</span>`;
    document.getElementById('mini-track-name').textContent = track.name;
  } else {
    document.getElementById('track-name').innerHTML = currentAlbum.title;
    document.getElementById('mini-track-name').textContent = currentAlbum.title;
  }
  
  document.querySelectorAll('.track').forEach((t, i) => {
    t.classList.toggle('playing', i === currentTrackIndex);
  });
  
  const playButton = document.getElementById('play');
  playButton.innerHTML = isPlaying ? 
    '<i class="fas fa-pause"></i>' : 
    '<i class="fas fa-play"></i>';
}

// Add mini-player toggle
document.querySelector('.mini-player-header').addEventListener('click', () => {
  document.querySelector('.mini-player').classList.toggle('expanded');
});

function togglePlay() {
  if (!currentAlbum) return;
  isPlaying = !isPlaying;
  if (isPlaying) {
    audioPlayer.play();
  } else {
    audioPlayer.pause();
  }
  updatePlayerUI();
}

function nextTrack() {
  if (!currentAlbum) return;
  currentTrackIndex = (currentTrackIndex + 1) % currentAlbum.tracks.length;
  loadAndPlayTrack();
}

function prevTrack() {
  if (!currentAlbum) return;
  currentTrackIndex = (currentTrackIndex - 1 + currentAlbum.tracks.length) % currentAlbum.tracks.length;
  loadAndPlayTrack();
}

function toggleLoop() {
  isLooping = !isLooping;
  audioPlayer.loop = isLooping;
  document.getElementById('loop').classList.toggle('active');
}

function toggleShuffle() {
  isShuffling = !isShuffling;
  document.getElementById('shuffle').classList.toggle('active');
  if (isShuffling) {
    shuffledIndices = [...Array(currentAlbum.tracks.length).keys()];
    for (let i = shuffledIndices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledIndices[i], shuffledIndices[j]] = [shuffledIndices[j], shuffledIndices[i]];
    }
  }
}

function getNextTrackIndex() {
  if (isShuffling) {
    const currentShuffleIndex = shuffledIndices.indexOf(currentTrackIndex);
    return shuffledIndices[(currentShuffleIndex + 1) % shuffledIndices.length];
  }
  return (currentTrackIndex + 1) % currentAlbum.tracks.length;
}

function getPrevTrackIndex() {
  if (isShuffling) {
    const currentShuffleIndex = shuffledIndices.indexOf(currentTrackIndex);
    return shuffledIndices[(currentShuffleIndex - 1 + shuffledIndices.length) % shuffledIndices.length];
  }
  return (currentTrackIndex - 1 + currentAlbum.tracks.length) % currentAlbum.tracks.length;
}

// Event Listeners
document.getElementById('play').addEventListener('click', togglePlay);
document.getElementById('next').addEventListener('click', nextTrack);
document.getElementById('prev').addEventListener('click', prevTrack);
document.getElementById('loop').addEventListener('click', toggleLoop);
document.getElementById('shuffle').addEventListener('click', toggleShuffle);

// Initialize the player
renderAlbums();
