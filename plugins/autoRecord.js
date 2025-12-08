// plugins/autoRecord.js
const { cmd } = require("../command");
const fs = require("fs");
const config = require("../config");

cmd(
  {
    pattern: "autorecord",
    alias: ["autorc", "recording"],
    desc: "Turn auto-recording presence ON or OFF",
    category: "owner",
    react: "🎙️",
    filename: __filename,
    fromMe: true, // Only bot owner can run
  },
  async (malvin, mek, m, { args, reply }) => {
    try {
      if (!args[0]) return reply("❌ Usage: autorecord <on|off>");

      const option = args[0].toLowerCase();

      if (option === "on") {
        config.AUTO_RECORD = true;
        fs.writeFileSync("./config.json", JSON.stringify(config, null, 2));
        reply("✅ Auto-recording is now *ON* ✅");
      } else if (option === "off") {
        config.AUTO_RECORD = false;
        fs.writeFileSync("./config.json", JSON.stringify(config, null, 2));
        reply("❌ Auto-recording is now *OFF* ❌");
      } else {
        reply("❌ Invalid option. Use *on* or *off*.");
      }
    } catch (e) {
      console.error("AutoRecord Error:", e);
      reply("❌ Failed to change auto-recording setting.");
    }
  }
);

// Optionally, in your main message handler, check this config:
module.exports.handleAutoRecord = async (malvin, from) => {
  if (config.AUTO_RECORD) {
    await malvin.sendPresenceUpdate("recording", from);
  }
};