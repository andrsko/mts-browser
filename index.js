const apiURL =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
    ? "http://localhost:8000/"
    : "https://maintechstream.herokuapp.com/";

const apiChannelsURL = apiURL + "channels/";

// get channels

let numberOfChannels = 1;
let tagsByChannel = {};

const menuEl = document.getElementById("menu");
const controllerEl = document.getElementById("controller");

fetch(apiChannelsURL)
  .then((response) => response.json())
  .then((data) => {
    numberOfChannels = data["n"];
    tagsByChannel = data["tags"];

    // update layout
    menuEl.classList.remove("loading");
    controllerEl.classList.remove("loading");
    setChannelElText();
  });

// figure out channel id
let channelId = 1;
if (window.location.pathname !== "/")
  channelId = parseInt(window.location.pathname.substring(3));

// change channel html content
const channelElement = document.getElementById("channel");
function setChannelElText() {
  channelElement.innerText =
    channelId + ". " + tagsByChannel[channelId].join(", ");
}

// create youtube player

// Load the IFrame Player API code asynchronously.
var tag = document.createElement("script");
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

let initialVideo;
let player;

function onYouTubeIframeAPIReady() {
  fetch(apiChannelsURL + channelId)
    .then((response) => response.json())
    .then((data) => {
      initialVideo = data;
      console.log("START AT: " + typeof initialVideo.startAt);
      player = new YT.Player("player", {
        width: "640",
        height: "390",
        playerVars: {
          autoplay: 1,
          mute: 1,
          start: parseInt(initialVideo.startAt),
        },
        videoId: initialVideo.id,
        events: {
          onStateChange: onPlayerStateChange,
        },
      });
    });
}

// get being currently streamed video
function fetchCurrent() {
  fetch(apiChannelsURL + channelId)
    .then((response) => response.json())
    .then((currentVideo) => {
      player.loadVideoById({
        videoId: currentVideo.id,
        startSeconds: currentVideo.startAt < 5 ? 0 : currentVideo.startAt,
      });
    });
}

// get next video when current ends
function onPlayerStateChange(event) {
  if (event.data === YT.PlayerState.ENDED) {
    fetchCurrent();
  }
}

// process button clicks

function switchChannel(e) {
  const action = e.currentTarget.id;
  if (action === "next") {
    if (channelId + 1 <= numberOfChannels) ++channelId;
    else channelId = 1;
  } else if (action === "prev") {
    if (channelId - 1 >= 1) --channelId;
    else channelId = numberOfChannels;
  }

  setChannelElText(channelId);

  fetchCurrent();

  window.history.replaceState({}, "", `/c/${channelId}`);
}

var nextButton = document.getElementById("next");
nextButton.addEventListener("click", switchChannel);

var prevButton = document.getElementById("prev");
prevButton.addEventListener("click", switchChannel);
