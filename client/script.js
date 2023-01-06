import bot from "./assets/camera.png";
import user from "./assets/cat.png";

const form = document.querySelector("form");
const chatContainer = document.querySelector("#chat_container");

let loadInterval;

function loader(element) {
  element.textContent = "";
  loadInterval = setInterval(() => {
    element.textContent += ".";
    if (element.textContent === "....") element.textContent = "";
  }, 300);
}

function renderImage(element, text) {
  element.innerHTML += `<img src=${text} />`;
}

// Unique ID for each message
function generateUniqueId() {
  const timestamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);
  return `id-${timestamp}-${hexadecimalString}`;
}

// Create column for the user and robot
function chatColumn(isAi, value, uniqueId) {
  return `
            <div class="wrapper ${isAi && "ai"}">
                <div class="chat">
                    <div class="profile">
                        <img
                            src="${isAi ? bot : user}"
                            alt="${isAi ? "bot" : "user"}"
                        />
                    </div>
                    <div class="${
                      isAi ? "dall-e-message" : "message"
                    }" id=${uniqueId}>${value}</div>
                </div>
            </div>
        `;
}

const handleSubmit = async (e) => {
  e.preventDefault();
  const data = new FormData(form);

  // user's chat
  chatContainer.innerHTML += chatColumn(false, data.get("prompt"));
  form.reset();

  // robot's chat
  const uniqueId = generateUniqueId();
  chatContainer.innerHTML += chatColumn(true, "", uniqueId);

  // make the window auto scroll
  chatContainer.scrollTop = chatContainer.scrollHeight;

  // check if bot is typing and passing in loader
  const messageDiv = document.getElementById(uniqueId);
  loader(messageDiv);

  // get response from openAI
  const response = await fetch("http://localhost:5000", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt: data.get("prompt") }),
  });

  clearInterval(loadInterval);
  messageDiv.innerHTML = "";

  if (response.ok) {
    const data = await response.json();
    console.log("data ", data);
    renderImage(messageDiv, data.url);
  } else {
    const err = await response.text();
    messageDiv.innerHTML = "Error, something went wrong...";
    alert(err);
  }
};

form.addEventListener("submit", handleSubmit);
form.addEventListener("keyup", (e) => {
  if (e.keyCode === 13) {
    handleSubmit(e);
  }
});
