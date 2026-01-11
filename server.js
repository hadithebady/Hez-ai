const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

// Serve static frontend
app.use(express.static(path.join(__dirname, "public")));

// Plugin connection endpoint
let connectedPlugins = {};

app.post("/connect-plugin", (req, res) => {
    const userId = uuidv4();
    connectedPlugins[userId] = true;
    console.log(`[Hez AI] Plugin connected: ${userId}`);
    res.json({
        userId,
        message: "✅ Plugin connected successfully"
    });
});

// Audit log endpoint
app.post("/send-message", (req, res) => {
    const { userId, message } = req.body;
    if (!connectedPlugins[userId]) {
        return res.json({ error: "Plugin not connected" });
    }
    console.log(`[Hez AI] Audit log from ${userId}: ${message}`);
    res.json({ answer: `✅ Plugin processed request: "${message}"` });
});

// Serve index.html on root
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Hez AI server running on port ${PORT}`);
});

