let currentSong = new Audio();
let Songs;
let folder;

function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedMinutes} : ${formattedSeconds}`;
}

async function getSongs(folder) {
  currFolder = folder;
  let a = await fetch(`http://127.0.0.1:5500/${folder}/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  Songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      Songs.push(element.href.split(`/${folder}/`)[1]);
    }
  }

  let songUL = document
    .querySelector(".songList")
    .getElementsByTagName("ul")[0];

  songUL.innerHTML = "";
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

}

const playMusic = (track, pause = false) => {
  currentSong.src = `/${currFolder}/` + track;
  if (!pause) {
    currentSong.play();
    play.src = "/PLAYLIST IMG/pause.svg";
  }

  document.querySelector(".songName").innerHTML = decodeURI(track);
  document.querySelector(".songTimer").innerHTML = "00:00 / 00:00";

};

async function displayAlbums(){
  let a = await fetch(`http://127.0.0.1:5500/Songs/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let anchors = div.getElementsByTagName("a")
  console.log(anchors)
  Array.from(anchors).forEach(e=>{
    if(e.href.includes("/Songs")){
      console.log(e.href)
    }
  })
  console.log(div)
}

async function main() {
  await getSongs("Songs/cs");
  playMusic(Songs[0], true);

  // Displaying the albums
  displayAlbums()

  
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

    // Adding Event Listener to previous and next
    document.querySelector("#previous").addEventListener("click",()=>{
      console.log("Previous clicked")
      let index = Songs.indexOf((currentSong.src.split("/").slice(-1))[0])
      if((index - 1) >= 0){
        playMusic(Songs[index-1])
      }
    })

    next.addEventListener("click", ()=>{
      currentSong.pause()
      console.log("Next Clicked")
      let index = Songs.indexOf((currentSong.src.split("/").slice(-1))[0])
      if((index + 1) < Songs.length){
        playMusic(Songs[index+1])
      }
    })

    // Adding eventListener to the Volume buttons
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e)=>{
      console.log("Volume is--> " + e.target.value + " / 100")
      currentSong.volume = parseInt(e.target.value)/100;
    })

    // Loading Playlists when cards are clicked
    Array.from(document.getElementsByClassName("card")).forEach(e=>{
      e.addEventListener("click", async item=>{
        let Songs = await getSongs(`Songs/${item.currentTarget.dataset.folder}`);
      })
    })
}

main();
