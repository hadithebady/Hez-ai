const express = require("express");
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.static(__dirname));

let state = {
  pluginConnected: false,
  permissionsGranted: false,
  queue: []
};

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/plugin/connect", (req, res) => {
  state.pluginConnected = true;
  state.permissionsGranted = false;
  console.log("Plugin connected");
  res.json({ success: true });
});

app.get("/plugin/status", (req, res) => {
  res.json(state);
});

app.post("/plugin/permissions", (req, res) => {
  state.permissionsGranted = true;
  console.log("Permissions granted");
  res.json({ success: true });
});

app.post("/ai/instruction", (req, res) => {
  if (!state.permissionsGranted) {
    return res.status(403).json({ error: "Permission not granted" });
  }

  state.queue.push(req.body);
  res.json({ queued: true });
});

app.get("/plugin/next", (req, res) => {
  const next = state.queue.shift() || null;
  res.json(next);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Hez AI server running on", PORT);
});
