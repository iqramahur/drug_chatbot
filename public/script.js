async function sendMessage() {
  console.log("💬 sendMessage() triggered");

  const input = document.getElementById("user-input");
  const chatLog = document.getElementById("chat-log");

  const userMessage = input.value.trim();  // ✅ must be here!
  console.log("📤 Sending:", userMessage);

  if (!userMessage) return;

  chatLog.innerHTML += `<div class="message user"><strong>You:</strong> ${userMessage}</div>`;
  input.value = "";
  chatLog.innerHTML += `<div class="message bot" id="loading">Bot: Thinking...</div>`;

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMessage }), // ✅ using userMessage
    });

    const data = await response.json();
    document.getElementById("loading").remove();

    console.log("📥 Response from /api/chat:", data);
    chatLog.innerHTML += `<div class="message bot"><strong>Bot:</strong> ${data.reply}</div>`;
    chatLog.scrollTop = chatLog.scrollHeight;
  } catch (err) {
    document.getElementById("loading").remove();
    chatLog.innerHTML += `<div class="message bot"><strong>Bot:</strong> Server error.</div>`;
    console.error("Error:", err);
  }
}
