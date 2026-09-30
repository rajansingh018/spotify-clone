const audio = new Audio();
const songCards = document.querySelectorAll(".song-card");
const musicCards = document.querySelectorAll(".music-card");

const player = document.querySelector(".music-player");
const playerImage = document.querySelector("#player-image");
const playerTitle = document.querySelector("#player-title");
const playerArtist = document.querySelector("#player-artist");

const playBtn = document.querySelectorAll(".play-btn");
const rtBoxNvbrtitle = document.querySelector("#rtbx-title");
const rtBoxNvbrtitleby = document.querySelector("#rtbx-songby");
//Ek variable jo yaad rakhega ki abhi kaun sa button active hai
let currentActivePlaybtn = null;
let currentCardIndex = 0;

function resetAllSongButtons() {
    playBtn.forEach(btn => {
        btn.textContent = "▶";
    });
}
function togglePlayPause() {
    if (!audio.src) {
        alert("Please select a song first!");
        return;
    }
    const footerPlayBtn = playBtn[playBtn.length - 1];
    if (audio.paused) {
        audio.play();
        if (currentActivePlaybtn) {
            currentActivePlaybtn.textContent = "❙ ❙"
        }
        footerPlayBtn.textContent = "❙ ❙";
    }
    else {
        audio.pause();
        if (currentActivePlaybtn) {
            currentActivePlaybtn.textContent = "▶";
        }
        footerPlayBtn.textContent = "▶";
    }
}



songCards.forEach((card, index) => {

    const cardPlayBtn = card.querySelector(".play-btn");

    card.addEventListener("click", () => {
        currentCardIndex = index;
        const randomColor = getRandomColor();
        // Card ke andar jo specific play button hai use select karne ke liye
        const songSrc = card.getAttribute("data-song");

        // Agar same gaana dobara click hua hai, to use play/pause toggle karein
        if (audio.src && audio.src.includes(songSrc)) {
            togglePlayPause();
            return;
        }
        //logic to play new song
        audio.src = songSrc;
        audio.play();
        resetAllSongButtons();

        cardPlayBtn.textContent = "❙ ❙";
        currentActivePlaybtn = cardPlayBtn;
        playBtn[playBtn.length - 1].textContent = "❙ ❙";

        // Player UI update karein
        player.style.display = "flex";
        playerImage.src = card.querySelector("img").src;
        playerTitle.textContent = card.querySelector("h4").textContent;
        playerArtist.textContent = card.querySelector("p").textContent;

        rtBoxNvbrtitle.textContent = card.querySelector("h4").textContent;
        rtBoxNvbrtitleby.textContent = card.querySelector("p").textContent;
        updateRightBox(card);
        document.querySelector(".lyrics-container").style.backgroundColor = randomColor;
    });
});
musicCards.forEach((card, index) => {
    const cardPlayBtn = card.querySelector(".play-btn");
    card.addEventListener("click", () => {
        currentCardIndex = index;
        const randomColor = getRandomColor();
        // Card ke andar jo specific play button hai use select karne ke liye
        const songSrc = card.getAttribute("data-song");
        // Agar same gaana dobara click hua hai, to use play/pause toggle karein
        if (audio.src.includes(songSrc)) {
            togglePlayPause();
            return;
        }
        //logic to play new song
        audio.src = songSrc;
        audio.play();
        resetAllSongButtons();

        cardPlayBtn.textContent = "❙ ❙";
        currentActivePlaybtn = cardPlayBtn;
        playBtn[playBtn.length - 1].textContent = "❙ ❙";

        // Player UI update karein
        player.style.display = "flex";
        playerImage.src = card.querySelector("img").src;
        playerTitle.textContent = card.querySelector("h4").textContent;
        playerArtist.textContent = card.querySelector("p").textContent;

        rtBoxNvbrtitle.textContent = card.querySelector("h4").textContent;
        rtBoxNvbrtitleby.textContent = card.querySelector("p").textContent;
        updateRightBox(card);

        document.querySelector(".lyrics-container").style.backgroundColor = randomColor;
    });
});

playBtn.forEach(playbtn => {
    playbtn.addEventListener("click", (e) => {
        e.stopPropagation();
        // Agar card ke play button par click hua hai aur wo naya gaana hai
        const card = playbtn.closest('.song-card');

        if (card && (!audio.src || !audio.src.includes(card.getAttribute("data-song")))) {
            card.click(); // Poore card ka click trigger kar dein taaki naya gaana load ho jaye
        } else {
            togglePlayPause(); // Same gaana hai to sirf play/pause toggle karein
        }

    });
});

const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

function prevSong() {
    currentCardIndex--;
    if (currentCardIndex < 0) {
        currentCardIndex = musicCards.length - 1;
    }
    musicCards[currentCardIndex].click();
}
function nextSong() {
    currentCardIndex++;
    if (currentCardIndex > musicCards.length - 1) {
        currentCardIndex = 0;
    }
    musicCards[currentCardIndex].click();
}
prevBtn.addEventListener("click", () => {
    prevSong();
});
nextBtn.addEventListener("click", () => {
    nextSong();
});

const progressBar = document.querySelector("#progress-bar");
const currentTimeEl = document.querySelector("#current-time"); // Apni sahi ID dalein
const durationEl = document.querySelector("#duration");

function formatTime(seconds) {
    if (isNaN(seconds)) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    // Agar mins ya secs 10 se kam hain toh aage '0' jodna
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// 1. Song chalne ke sath progress bar ko aage badhana
audio.addEventListener("timeupdate", () => {
    if (audio.duration) {
        // Percentage nikalna ki gana kitna chal chuka hai
        const progressPercent = (audio.currentTime / audio.duration) * 100;
        progressBar.value = progressPercent;

        //currentTime text update karo
        currentTimeEl.textContent = formatTime(audio.currentTime);
    }
});
audio.addEventListener("loadedmetadata", () => {
    durationEl.textContent = formatTime(audio.duration);
});
// 2. Jab user progress bar ko pakad kar aage-piche kare (Seek functionality)
progressBar.addEventListener("input", () => {
    if (audio.duration) {
        // Slider ki value ke hisab se gaane ka time badalna
        const newTime = (progressBar.value / 100) * audio.duration;
        audio.currentTime = newTime;
        // Drag karte waqt bhi time turant update ho
        currentTimeEl.textContent = formatTime(newTime);
    }
});
audio.addEventListener("ended", ()=>{
    nextSong();
});

const bgVideo = document.querySelector("#bg-video");
const songLyricsEl = document.querySelector("#song-lyrics");

function updateRightBox(card) {
    const videoSrc = card.getAttribute("data-video");
    const lyricsText = card.getAttribute("data-lyrics");

    // 1. Video Update Logic
    if (videoSrc) {
        bgVideo.src = videoSrc;
        bgVideo.style.display = "block";
        bgVideo.play().catch(err => console.log("Video autoplay blocked or error:", err));
    } else {
        bgVideo.textContent = "Play Your Fav Song";
        // bgVideo.style.display = "content"; // Agar video na ho toh hide kar dein
    }

    // 2. Lyrics Update Logic
    if (lyricsText) {
        songLyricsEl.textContent = lyricsText;
    } else {
        songLyricsEl.textContent = "Lyrics not available for this song.";
    }
}

const libBtnAll = document.getElementById('lib-btn-all');
const libBtnMusic = document.getElementById('lib-btn-music');
const middleContent = document.querySelector(".middle-box-content");
const topMusicCard = document.querySelector(".musicCardsbox");

libBtnMusic.addEventListener("click", () => {
        middleContent.scrollTo({
            top: topMusicCard.offsetTop,
            behavior: "smooth"
        });
});

libBtnAll.addEventListener("click", () => {
        middleContent.scrollTo({
            top: 0,
            behavior: "smooth"
        });
});
const songSearch = document.getElementById("song-search");
songSearch.addEventListener("input", ()=>{
    const searchValue = songSearch.value.toLowerCase().trim();
    songCards.forEach(card => {
        const songName = card.querySelector("h4").textContent.toLowerCase();
        const artistName = card.querySelector("p").textContent.toLowerCase();

        if (
            songName.includes(searchValue) ||
            artistName.includes(searchValue)
        ) {
            card.style.display = "";
        } else {
            card.style.display = "none";
        }
    });
});

const profilePic = document.getElementById('profilePic');
const profileMenu = document.getElementById('profileMenu');

profilePic.addEventListener('click', (event) => {
    event.stopPropagation();
    profileMenu.classList.toggle('show');
});

document.addEventListener('click', () => {
    profileMenu.classList.remove('show');
});
const logOutBtn = document.getElementById('logoutBtn');
logOutBtn.addEventListener('click', ()=>{
    alert('Logged Out Succesfully!');
    window.location.href = 'index.html'
});

// Random Hex Color Generate karne ka function
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
