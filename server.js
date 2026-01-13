const express = require("express");
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.static(__dirname));

let pluginConnected = false;

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// 🔑 PLUGIN CONNECT ENDPOINT
app.post("/plugin/connect", (req, res) => {
  pluginConnected = true;
  console.log("Plugin connected");
  res.json({ success: true, message: "Connected successfully" });
});

// 🔒 CHECK CONNECTION
app.get("/plugin/status", (req, res) => {
  res.json({ connected: pluginConnected });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
