/* ==========================================================================
   Jaidatech Glassmorphic Music Player JavaScript Logic
   ========================================================================== */

// 1. Tracks Database (Uses free public streams from SoundHelix)
const trackList = [
  {
    id: 0,
    title: "Celestial Voyager",
    artist: "Jaidatech Sound Labs",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    art: "https://picsum.photos/400/400?random=11",
    duration: "6:12"
  },
  {
    id: 1,
    title: "Quantum Flux",
    artist: "Jaidatech Sound Labs",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    art: "https://picsum.photos/400/400?random=12",
    duration: "7:05"
  },
  {
    id: 2,
    title: "Nebula Dreams",
    artist: "Jaidatech Sound Labs",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    art: "https://picsum.photos/400/400?random=13",
    duration: "5:44"
  },
  {
    id: 3,
    title: "Starlight Synapse",
    artist: "Jaidatech Sound Labs",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    art: "https://picsum.photos/400/400?random=14",
    duration: "5:02"
  },
  {
    id: 4,
    title: "Holographic Horizon",
    artist: "Jaidatech Sound Labs",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
    art: "https://picsum.photos/400/400?random=15",
    duration: "6:03"
  }
];

// 2. State Variables
let currentTrackIndex = 0;
let isPlaying = false;
let isShuffle = false;
let isRepeat = false;

// 3. HTML Element References
const audio = new Audio();
const trackArt = document.getElementById("track-art");
const vinylDisc = document.getElementById("vinyl-disc");
const trackTitle = document.getElementById("track-title");
const trackArtist = document.getElementById("track-artist");

const btnPlay = document.getElementById("btn-play");
const playIcon = document.getElementById("play-icon");
const btnPrev = document.getElementById("btn-prev");
const btnNext = document.getElementById("btn-next");
const btnShuffle = document.getElementById("btn-shuffle");
const btnRepeat = document.getElementById("btn-repeat");

const currentTimeEl = document.getElementById("current-time");
const totalDurationEl = document.getElementById("total-duration");
const progressBar = document.getElementById("progress-bar");
const progressContainer = document.getElementById("progress-bar-wrapper");

const volumeSlider = document.getElementById("volume-slider");
const volumeIcon = document.getElementById("volume-icon");
const trackListContainer = document.getElementById("track-list");
const dateDisplay = document.getElementById("date-display");

// 4. Initial Setup
window.addEventListener("DOMContentLoaded", () => {
  loadTrack(currentTrackIndex);
  generateQueue();
  updateHeaderDate();
  
  // Set default volume
  audio.volume = volumeSlider.value;
});

// Update Header Calendar Date
function updateHeaderDate() {
  const options = { month: 'long', day: 'numeric', year: 'numeric' };
  dateDisplay.textContent = new Date().toLocaleDateString('en-US', options);
}

// 5. Load and Play Tracks
function loadTrack(index) {
  const track = trackList[index];
  
  audio.src = track.url;
  trackArt.src = track.art;
  trackTitle.textContent = track.title;
  trackArtist.textContent = track.artist;
  
  // Update active status in the queue DOM
  const items = document.querySelectorAll(".queue-item");
  items.forEach((item, i) => {
    if (i === index) {
      item.classList.add("active");
      // Add a dynamic indicator if playing
      if (!item.querySelector(".queue-playing-icon") && isPlaying) {
        const icon = document.createElement("i");
        icon.setAttribute("data-lucide", "volume-2");
        icon.className = "queue-playing-icon";
        item.appendChild(icon);
        lucide.createIcons();
      }
    } else {
      item.classList.remove("active");
      const icon = item.querySelector(".queue-playing-icon");
      if (icon) icon.remove();
    }
  });

  // Reset progress bar
  progressBar.style.width = "0%";
  currentTimeEl.textContent = "0:00";
  totalDurationEl.textContent = track.duration;
}

function playTrack() {
  isPlaying = true;
  audio.play().catch(e => console.log("Audio play postponed until user interaction: ", e));
  
  // Toggle UI elements
  playIcon.setAttribute("data-lucide", "pause");
  trackArt.classList.add("playing");
  vinylDisc.classList.add("playing");
  
  // Refresh Lucide Icons
  lucide.createIcons();
  
  // Update playing state in list
  updateQueueItemStates();
}

function pauseTrack() {
  isPlaying = false;
  audio.pause();
  
  // Toggle UI elements
  playIcon.setAttribute("data-lucide", "play");
  trackArt.classList.remove("playing");
  vinylDisc.classList.remove("playing");
  
  lucide.createIcons();
  updateQueueItemStates();
}

function togglePlay() {
  if (isPlaying) {
    pauseTrack();
  } else {
    playTrack();
  }
}

// 6. Navigation Controls
function prevTrack() {
  currentTrackIndex--;
  if (currentTrackIndex < 0) {
    currentTrackIndex = trackList.length - 1;
  }
  loadTrack(currentTrackIndex);
  if (isPlaying) playTrack();
}

function nextTrack() {
  if (isShuffle) {
    playRandomTrack();
  } else {
    currentTrackIndex++;
    if (currentTrackIndex >= trackList.length) {
      currentTrackIndex = 0;
    }
    loadTrack(currentTrackIndex);
    if (isPlaying) playTrack();
  }
}

function playRandomTrack() {
  let randomIndex;
  do {
    randomIndex = Math.floor(Math.random() * trackList.length);
  } while (randomIndex === currentTrackIndex);
  
  currentTrackIndex = randomIndex;
  loadTrack(currentTrackIndex);
  playTrack();
}

// 7. Track Queue Operations
function generateQueue() {
  trackListContainer.innerHTML = "";
  
  trackList.forEach((track, index) => {
    const item = document.createElement("div");
    item.className = `queue-item ${index === currentTrackIndex ? 'active' : ''}`;
    item.addEventListener("click", () => {
      currentTrackIndex = index;
      loadTrack(index);
      playTrack();
    });
    
    item.innerHTML = `
      <img src="${track.art}" alt="${track.title}" class="queue-art">
      <div class="queue-details">
        <span class="queue-title">${track.title}</span>
        <span class="queue-artist">${track.artist}</span>
      </div>
      <span class="queue-duration">${track.duration}</span>
    `;
    
    trackListContainer.appendChild(item);
  });
}

function updateQueueItemStates() {
  const items = document.querySelectorAll(".queue-item");
  items.forEach((item, index) => {
    const icon = item.querySelector(".queue-playing-icon");
    if (index === currentTrackIndex && isPlaying) {
      if (!icon) {
        const newIcon = document.createElement("i");
        newIcon.setAttribute("data-lucide", "volume-2");
        newIcon.className = "queue-playing-icon";
        item.appendChild(newIcon);
        lucide.createIcons();
      }
    } else {
      if (icon) icon.remove();
    }
  });
}

// 8. Progress and Time Tracking
function updateProgress(e) {
  const { duration, currentTime } = e.srcElement;
  if (!duration) return;
  
  const progressPercent = (currentTime / duration) * 100;
  progressBar.style.width = `${progressPercent}%`;
  
  // Format current and total times
  currentTimeEl.textContent = formatTime(currentTime);
  totalDurationEl.textContent = formatTime(duration);
}

function setProgress(e) {
  const width = this.clientWidth;
  const clickX = e.offsetX;
  const duration = audio.duration;
  
  if (duration) {
    audio.currentTime = (clickX / width) * duration;
  }
}

function formatTime(seconds) {
  if (isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// 9. Volume Control
function handleVolumeChange() {
  const value = volumeSlider.value;
  audio.volume = value;
  
  // Change volume icon dynamically
  if (value == 0) {
    volumeIcon.setAttribute("data-lucide", "volume-x");
  } else if (value < 0.4) {
    volumeIcon.setAttribute("data-lucide", "volume");
  } else if (value < 0.7) {
    volumeIcon.setAttribute("data-lucide", "volume-1");
  } else {
    volumeIcon.setAttribute("data-lucide", "volume-2");
  }
  lucide.createIcons();
}

// 10. Event Listeners
btnPlay.addEventListener("click", togglePlay);
btnPrev.addEventListener("click", prevTrack);
btnNext.addEventListener("click", nextTrack);

btnShuffle.addEventListener("click", () => {
  isShuffle = !isShuffle;
  btnShuffle.classList.toggle("active", isShuffle);
});

btnRepeat.addEventListener("click", () => {
  isRepeat = !isRepeat;
  btnRepeat.classList.toggle("active", isRepeat);
});

audio.addEventListener("timeupdate", updateProgress);
audio.addEventListener("ended", () => {
  if (isRepeat) {
    audio.currentTime = 0;
    playTrack();
  } else {
    nextTrack();
  }
});

progressContainer.addEventListener("click", setProgress);
volumeSlider.addEventListener("input", handleVolumeChange);
