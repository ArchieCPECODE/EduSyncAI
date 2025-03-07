async function sendMessage() {
    const userInput = document.getElementById("user-input");
    const chatBox = document.getElementById("chat-box");

    if (userInput.value.trim() === "") return;

    // Display user message
    const userMessage = document.createElement("div");
    userMessage.className = "user-message";
    userMessage.textContent = "You: " + userInput.value;
    chatBox.appendChild(userMessage);
    chatBox.scrollTop = chatBox.scrollHeight;

    try {
        const response = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: userInput.value })
        });

        const data = await response.json();

        // Display bot response
        const botMessage = document.createElement("div");
        botMessage.className = "bot-message";
        botMessage.textContent = "AI: " + (data.reply || "Sorry, I couldn't understand.");
        chatBox.appendChild(botMessage);
        chatBox.scrollTop = chatBox.scrollHeight;
    } catch (error) {
        console.error("Error:", error);
    }

    userInput.value = "";
}
