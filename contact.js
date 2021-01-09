const apiURL =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
    ? "http://localhost:8000/"
    : "https://maintechstream.herokuapp.com/";

const containerEl = document.getElementById("container");

const nameEl = document.getElementById("name");
const emailEl = document.getElementById("email");
const topicEl = document.getElementById("topic");
const messageEl = document.getElementById("message");

const emptyMessageErrorEl = document.getElementById("empty-input-error");

const submitEl = document.getElementById("submit");
const submitElInitialInnerHTML = submitEl.innerHTML;

const successMessageHTML = `<p id='success'>Your message has been successfully sent</p>`;

messageEl.focus();

submitEl.addEventListener("click", onSubmit);
function onSubmit() {
  //var csrftoken = document.cookie;

  //console.log("CSRF: " + csrftoken);

  if (messageEl.value) {
    emptyMessageErrorEl.style.display = "none";

    submitEl.innerHTML = "";
    const loadingAnimation = `    <i
    class="fa fa-circle-o-notch fa-spin"
  ></i
  >`;
    submitEl.insertAdjacentHTML("beforeend", loadingAnimation);

    const data = {
      name: nameEl.value,
      email: emailEl.value,
      topic: topicEl.value,
      message: messageEl.value,
    };

    fetch(apiURL + "feedbacks/", {
      method: "POST",
      body: JSON.stringify(data),
    })
      .then((response) => {
        console.log(JSON.stringify(response));
        if (response.ok) {
          containerEl.insertAdjacentHTML("beforeend", successMessageHTML);
        } else alert("An error occured");
      })
      .catch((error) => {
        console.error("Error:", error);
      })
      .finally(() => (submitEl.innerHTML = submitElInitialInnerHTML));
  } else emptyMessageErrorEl.style.display = "block";
}

window.onSubmit = onSubmit;
