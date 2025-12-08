// plugins/antidelete.js
const { cmd } = require("../command");
const fs = require("fs");
const path = require("path");

const storageDir = path.join(__dirname, "..", "storage");
const settingsFile = path.join(storageDir, "antidelete.json");

// Ensure storage folder + file exist
if (!fs.existsSync(storageDir)) {
  fs.mkdirSync(storageDir, { recursive: true });
}
if (!fs.existsSync(settingsFile)) {
  fs.writeFileSync(settingsFile, JSON.stringify({}, null, 2));
}

let antidelete = JSON.parse(fs.readFileSync(settingsFile));

// Save function
function save() {
  fs.writeFileSync(settingsFile, JSON.stringify(antidelete, null, 2));
}

// Command to toggle antidelete
cmd(
  {
    pattern: "antidelete",
    desc: "Enable or disable Anti-Delete",
    react: "🛡️",
    category: "utility",
    filename: __filename,
  },
  async (conn, mek, m, { from, reply, args }) => {
    let status = args[0]?.toLowerCase();

    if (!status || !["on", "off"].includes(status)) {
      return reply("⚙️ Usage: `.antidelete on` or `.antidelete off`");
    }

    antidelete[from] = status === "on";
    save();

    reply(`🛡️ Anti-Delete has been *${status.toUpperCase()}* for this chat.`);
  }
);

// Listener to catch deletes
cmd(
  {
    on: "message.delete",
  },
  async (conn, mek) => {
    let from = mek.key.remoteJid;
    if (!antidelete[from]) return; // Not enabled

    let msg = mek.message;
    if (!msg) return;

    try {
      let sender = mek.participant || mek.key.fromMe ? conn.user.id : mek.key.participant;

      // Forward deleted message
      await conn.sendMessage(
        from,
        { forward: mek }, // Re-send deleted message
        { quoted: mek }
      );

      // Notify
      await conn.sendMessage(
        from,
        {
          text: `⚠️ Anti-Delete Triggered!\n👤 *User:* @${sender.split("@")[0]}`,
          mentions: [sender],
        }
      );
    } catch (e) {
      console.error("AntiDelete Error:", e);
    }
  }
);
