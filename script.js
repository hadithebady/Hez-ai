const statusText = document.getElementById("status");
const input = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const chat = document.getElementById("chat");
const permissionBox = document.getElementById("permissionBox");
const allowBtn = document.getElementById("allowBtn");

input.disabled = true;
sendBtn.disabled = true;

function addMessage(role, text) {
  const div = document.createElement("div");
  div.className = role;
  div.innerText = text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

async function checkStatus() {
  const res = await fetch("/plugin/status");
  const data = await res.json();

  if (data.pluginConnected) {
    statusText.innerText = "Plugin connected";

    if (!data.permissionsGranted) {
      permissionBox.style.display = "block";
      input.disabled = true;
      sendBtn.disabled = true;
    } else {
      permissionBox.style.display = "none";
      input.disabled = false;
      sendBtn.disabled = false;
    }
  } else {
    statusText.innerText = "Plugin not connected";
    input.disabled = true;
    sendBtn.disabled = true;
  }
}

setInterval(checkStatus, 2000);
checkStatus();

allowBtn.onclick = async () => {
  await fetch("/plugin/permissions", { method: "POST" });
  permissionBox.style.display = "none";
  input.disabled = false;
  sendBtn.disabled = false;
  addMessage("assistant", "Permission granted. What would you like to create?");
};

sendBtn.onclick = async () => {
  const msg = input.value.trim();
  if (!msg) return;

  addMessage("user", msg);
  input.value = "";

  const instruction = {
    action: "create_script",
    name: "GeneratedScript",
    content: `print("Created by Hez AI")`
  };

  await fetch("/ai/instruction", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(instruction)
  });

  addMessage("assistant", "Added script to ServerScriptService");
};
