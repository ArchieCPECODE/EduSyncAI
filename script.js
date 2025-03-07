function sendMessage() {
    const userInput = document.getElementById('user-input').value;
    if (!userInput.trim()) return;

    appendMessage('user', userInput);
    document.getElementById('user-input').value = '';

    fetch('https://edu-sync-ai.vercel.app/api/chat', { // ✅ Updated API URL
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: userInput })
    })
    .then(response => response.json())
    .then(data => {
        appendMessage('bot', data.reply);
    })
    .catch(error => {
        appendMessage('bot', 'Error: Unable to connect to AI.');
        console.error("🔥 API Error:", error);
    });
}
