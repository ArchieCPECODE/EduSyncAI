const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-button"); // ✅ Added button support

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

    // ✅ Prevent multiple "Thinking..." messages
    const thinkingMessage = document.createElement("div");
    thinkingMessage.classList.add("chat-message", "bot");
    thinkingMessage.innerText = "Thinking...";
    chatBox.appendChild(thinkingMessage);
    chatBox.scrollTop = chatBox.scrollHeight;

    try {
        const response = await fetch("https://edu-sync-archiecpecodes-projects.vercel.app/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt: message })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        chatBox.removeChild(thinkingMessage); // ✅ Remove "Thinking..." message

        // ✅ Ensure AI response is not empty
        const aiResponse = data.response?.trim() || "Sorry, I couldn't understand that.";
        addMessage(aiResponse, "bot");

    } catch (error) {
        console.error("Error connecting to AI:", error);
        chatBox.removeChild(thinkingMessage); // ✅ Remove "Thinking..." message
        addMessage("Error: Unable to connect to AI.", "bot");
    }
}

// ✅ Add event listener to send message when "Enter" is pressed
userInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") sendMessage();
});

// ✅ Add event listener for send button click
if (sendButton) {
    sendButton.addEventListener("click", sendMessage);
}
