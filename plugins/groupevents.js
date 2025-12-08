// plugins/groupevents.js
const { cmd } = require("../command");
const fs = require("fs");

cmd(
  {
    pattern: "groupevents",
    react: "👥",
    desc: "Show all active group events & features",
    category: "group",
    filename: __filename,
  },
  async (malvin, mek, m, { from, reply }) => {
    try {
      // Check stored settings (if you saved them in JSON)
      let welcome = false, goodbye = false, antidelete = false, antilink = false;
      let warnSystem = false;

      if (fs.existsSync("./lib/welcome.json")) {
        const welcomeData = JSON.parse(fs.readFileSync("./lib/welcome.json"));
        welcome = welcomeData[from]?.welcome || false;
        goodbye = welcomeData[from]?.goodbye || false;
      }

      if (fs.existsSync("./lib/antidelete.json")) {
        const adData = JSON.parse(fs.readFileSync("./lib/antidelete.json"));
        antidelete = adData[from] || false;
      }

      if (fs.existsSync("./lib/antilink.json")) {
        const alData = JSON.parse(fs.readFileSync("./lib/antilink.json"));
        antilink = alData[from] || false;
      }

      if (fs.existsSync("./lib/warn.json")) {
        const warnData = JSON.parse(fs.readFileSync("./lib/warn.json"));
        warnSystem = warnData[from] || false;
      }

      // Message template
      const msg = `
👥 *NOVACORE Group Events Panel* ⚡

📥 Welcome Messages: ${welcome ? "✅ ON" : "❌ OFF"}
📤 Goodbye Messages: ${goodbye ? "✅ ON" : "❌ OFF"}
🛡️ Anti-Delete: ${antidelete ? "✅ ON" : "❌ OFF"}
🔗 Anti-Link: ${antilink ? "✅ ON" : "❌ OFF"}
⚠️ Warn System: ${warnSystem ? "✅ ON" : "❌ OFF"}

━━━━━━━━━━━━━━━
💡 Use specific cmds to enable/disable:
• .welcome on/off
• .goodbye on/off
• .antidelete on/off
• .antilink on/off
• .warn on/off
━━━━━━━━━━━━━━━
      `.trim();

      await reply(msg);
    } catch (e) {
      console.error(e);
      reply("❌ Error while fetching group events.");
    }
  }
);
