let currentSong = new Audio();

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

const playMusic = (track) => {
  currentSong.src = "/Songs/" + track;
  currentSong.play();
  play.src = "/PLAYLIST IMG/pause.svg";

  document.querySelector(".songName").innerHTML = track
  document.querySelector(".songTimer").innerHTML = "00:00 / 00:00"

};
async function main() {
  let Songs = await getSongs();

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
    } 
    else {
      currentSong.pause();
      play.src = "/PLAYLIST IMG/play.svg";
    }
  });
}

main();
