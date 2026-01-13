const statusText = document.getElementById("status");
const input = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");

input.disabled = true;
sendBtn.disabled = true;


function addMessage(text, sender){
    const msg = document.createElement("div");
    msg.className = `message ${sender}`;
    msg.innerText = text;
    chatDiv.appendChild(msg);
    chatDiv.scrollTop = chatDiv.scrollHeight;
}

// Send message to server (audit log)
async function sendMessage(){
    const text = input.value.trim();
    if(!text) return;
    input.value = "";

    if(!pluginConnected){
        addMessage("Plugin not connected", "ai");
        return;
    }

    addMessage(text, "user");

    try {
        const res = await fetch("/send-message", {
            method:"POST",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify({ userId, message: text })
        });
        const data = await res.json();
        if(data.error) addMessage(data.error,"ai");
        else addMessage(data.answer,"ai");
    } catch(err){
        addMessage("Error sending message","ai");
    }
}

sendBtn.onclick = sendMessage;
input.addEventListener("keydown", e=>{
    if(e.key === "Enter") sendMessage();
});

// Function called by plugin when it connects
window.pluginConnected = function(id){
    userId = id;
    pluginConnected = true;
    addMessage("✅ Plugin connected successfully", "ai");
}

