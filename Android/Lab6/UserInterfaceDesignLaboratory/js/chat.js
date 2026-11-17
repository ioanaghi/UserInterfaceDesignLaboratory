const chatButton = document.getElementById("chat-toggle");
const chatPanel = document.getElementById("chat-panel");
const chatOpenIcon = document.getElementById("chat-open-icon");
const chatCloseIcon = document.getElementById("chat-close-icon");
const authenticationForm = document.getElementById("chat-auth-form");
const usernameInput = document.getElementById("chat-username");
const passwordInput = document.getElementById("chat-password");
const authenticationButton = document.getElementById("chat-auth-button");
const authenticationMessage = document.getElementById("chat-auth-message");
const authenticationMessageText = document.getElementById("chat-auth-message-text");
const spinner = document.getElementById("chat-spinner");
const credentials = document.getElementById("chat-credentials");
const conversation = document.getElementById("chat-conversation");
const sendForm = document.getElementById("chat-send-form");
const newMessageInput = document.getElementById("chat-new-message");
const chatMessages = document.getElementById("chat-messages");

let chatIsOpen = false;
let animationIsRunning = false;
let isAuthenticated = false;

chatButton.addEventListener("click", function () {
    if (animationIsRunning) {
        return;
    }

    if (chatIsOpen) {
        closeChat();
    } else {
        openChat();
    }
});

function openChat() {
    animationIsRunning = true;
    chatIsOpen = true;
    chatPanel.classList.add("is-visible");
    chatPanel.setAttribute("aria-hidden", "false");
    chatButton.setAttribute("aria-expanded", "true");
    chatButton.setAttribute("aria-label", "Close chat");
    chatOpenIcon.hidden = true;
    chatCloseIcon.hidden = false;

    // Stage one: the 40 x 40 button widens into the chat title bar.
    chatButton.offsetWidth;
    chatButton.classList.add("expanded");

    setTimeout(function () {
        // Stage two: the 300 x 50 title bar reveals the 300 x 250 panel.
        chatPanel.classList.add("is-visible");
        chatPanel.offsetHeight;
        chatPanel.classList.add("stage-two");

        setTimeout(function () {
            chatPanel.classList.add("ready");
            animationIsRunning = false;
        }, 500);
    }, 500);
}

function closeChat() {
    animationIsRunning = true;
    chatPanel.classList.remove("ready");
    chatPanel.classList.remove("stage-two");

    // Close the same two stages in reverse order.
    setTimeout(function () {
        chatPanel.classList.remove("is-visible");

        setTimeout(function () {
            chatButton.classList.remove("expanded");
            chatPanel.setAttribute("aria-hidden", "true");
            chatButton.setAttribute("aria-expanded", "false");
            chatButton.setAttribute("aria-label", "Open chat");
            chatOpenIcon.hidden = false;
            chatCloseIcon.hidden = true;
            animationIsRunning = false;
        }, 500);
    }, 500);
}

authenticationForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (authenticationButton.disabled || isAuthenticated) {
        return;
    }

    const formInputs = authenticationForm.querySelectorAll("input");
    formInputs.forEach(function (input) {
        input.disabled = true;
    });
    authenticationButton.disabled = true;

    authenticationMessage.hidden = false;
    authenticationMessage.classList.remove("success");
    spinner.hidden = false;
    authenticationMessageText.textContent = "Processing ...";

    // Simulate waiting for a server for three seconds.
    setTimeout(function () {
        spinner.hidden = true;
        authenticationButton.disabled = false;

        if (usernameInput.value === "admin" && passwordInput.value === "admin1234") {
            isAuthenticated = true;
            authenticationMessage.classList.add("success");
            authenticationMessageText.textContent = "Authentication successful.";
            credentials.hidden = true;
            conversation.hidden = false;
        } else {
            authenticationMessageText.textContent = "Incorrect username or password.";

            formInputs.forEach(function (input) {
                input.disabled = false;
            });
        }
    }, 3000);
});

sendForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const messageText = newMessageInput.value.trim();

    if (messageText === "") {
        return;
    }

    const messageBubble = document.createElement("p");
    messageBubble.classList.add("chat-bubble");
    messageBubble.textContent = messageText;
    chatMessages.append(messageBubble);
    newMessageInput.value = "";
    newMessageInput.focus();
});
