let currentSong = new Audio();

function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "Invalid input";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedMinutes} : ${formattedSeconds}`;
}

async function getSongs() {
  let a = await fetch("http://127.0.0.1:5500/Songs/");
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  let Songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      Songs.push(element.href.split("/Songs/")[1]);
    }
  }
  return Songs;
}

const playMusic = (track, pause = false) => {
  currentSong.src = "/Songs/" + track;
  if (!pause) {
    currentSong.play();
    play.src = "/PLAYLIST IMG/pause.svg";
  }

  document.querySelector(".songName").innerHTML = decodeURI(track);
  document.querySelector(".songTimer").innerHTML = "00:00 / 00:00";
};
async function main() {
  let Songs = await getSongs();
  playMusic(Songs[0], true);
  let songUL = document
    .querySelector(".songList")
    .getElementsByTagName("ul")[0];
  for (const song of Songs) {
    songUL.innerHTML =
      songUL.innerHTML +
      `<li> <img class="invert" src="/PLAYLIST IMG/music.svg" alt="">
        <div class="songInfo">
          <div> ${song.replaceAll("%20", " ")}</div>
          <div>Punith</div>
        </div>
        <div class="playnow">
          <img class="invert" src="/PLAYLIST IMG/play.svg" alt="">
        </div>  </li> `;
  }

  Array.from(
    document.querySelector(".songList").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      console.log(e.querySelector(".songInfo").firstElementChild.innerText);
      playMusic(
        e.querySelector(".songInfo").firstElementChild.innerHTML.trim()
      );
    });
  });

  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "/PLAYLIST IMG/pause.svg";
    } else {
      currentSong.pause();
      play.src = "/PLAYLIST IMG/play.svg";
    }
  });

  // time update event
  currentSong.addEventListener("timeupdate", () => {
    console.log(currentSong.currentTime, currentSong.duration);
    document.querySelector(".songTimer").innerHTML = `${secondsToMinutesSeconds(
      currentSong.currentTime
    )} / ${secondsToMinutesSeconds(currentSong.duration)}`;

    // seekbar movement
    document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
  });

    // seekbar eventListner
    document.querySelector(".seekbar").addEventListener("click", e=>{
      let percent =  e.offsetX/e.target.getBoundingClientRect().width * 100
      document.querySelector(".circle").style.left = percent + "%";

      currentSong.currentTime = ((currentSong.duration) * percent) / 100;
    })

    // Adding eventListner to the Hamburger
    document.querySelector(".hamburger").addEventListener("click", ()=>{
      document.querySelector(".left").style.left = "0"
    })

    // Adding eventListner to the Close button
    document.querySelector(".close").addEventListener("click", ()=>{
      document.querySelector(".left").style.left = "-120%"
    })
}

main();
