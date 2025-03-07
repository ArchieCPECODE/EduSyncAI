const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");

// Function to add a message to the chat
function addMessage(text, sender) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("chat-message", sender);
    messageDiv.innerText = text;
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Function to send a message to the backend
async function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    // Display user message
    addMessage(message, "user");
    userInput.value = "";

    // Show "Thinking..." message
    addMessage("Thinking...", "bot");

    try {
        const response = await fetch("https://edu-sync-25mysi7ke-archiecpecodes-projects.vercel.app/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ prompt: message })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        chatBox.lastChild.remove(); // Remove "Thinking..."
        addMessage(data.response, "bot");
    } catch (error) {
        console.error("Error connecting to AI:", error);
        chatBox.lastChild.remove(); // Remove "Thinking..."
        addMessage("Error: Unable to connect to AI.", "bot");
    }
}

// Add event listener to send message when "Enter" is pressed
userInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        sendMessage();
    }
});
