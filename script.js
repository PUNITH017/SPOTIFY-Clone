

async function getSongs() {
    let a = await fetch("http://127.0.0.1:5500/Songs/")
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    let songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split("/Songs/")[1])
        }
    }
    return songs;
}
async function main(){
    let songs = await getSongs()
    console.log(songs);

    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li> <img class="invert" src="/PLAYLIST IMG/music.svg" alt="">
        <div class="songInfo">
          <div> ${song.replaceAll("%20" , " ")}</div>
          <div>Punith</div>
        </div>
        <div class="playnow">
          <img class="invert" src="/PLAYLIST IMG/play.svg" alt="">
        </div>  </li> ` ;

        
                
        
       
    }

    // playing the audio
    var audio = new Audio(songs[0]);
    audio.play();

    audio.addEventListener("loadeddata", () => {
        console.log(audio.duration,audio.currentSrc,audio.currentTime);
    });
}
 
main()