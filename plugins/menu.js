// plugins/menu.js
const { cmd, commands } = require("../command");
const config = require("../config");
const moment = require("moment");

cmd(
  {
    pattern: "menu",
    alias: ["help"],
    desc: "Show bot menu with all commands",
    category: "main",
    filename: __filename,
  },
  async (malvin, mek, m, { reply, from }) => {
    try {
      // Group commands by category
      let grouped = {};
      for (let c of commands) {
        if (!grouped[c.category]) grouped[c.category] = [];
        grouped[c.category].push(c.pattern);
      }

      // Count all commands
      let totalCmds = commands.length;

      // Time
      let time = moment().format("MMMM Do YYYY, h:mm:ss a");

      // Build menu text
      let menuText = `
🌌 *SUHO-MD V2 MENU* 🌌

📅 Date: ${time}
👑 Owner: Dev Sung
📦 Total Commands: ${totalCmds}

━━━━━━━━━━━━━━━━━━━
`;

      for (let cat in grouped) {
        menuText += `\n📂 *${cat.toUpperCase()}*\n`;
        grouped[cat].forEach((c) => {
          menuText += `> ${c}\n`;
        });
      }

      menuText += `
━━━━━━━━━━━━━━━━━━━
⚡ Type any command with (.) prefix to use.
      `;

      // Send with bot image
      await malvin.sendMessage(
        from,
        {
          image: { url: config.BOT_IMAGE || "https://files.catbox.moe/nho7jk.jpg" }, // replace with your bot's logo link
          caption: menuText,
        },
        { quoted: mek }
      );
    } catch (e) {
      reply("❌ Error generating menu!");
      console.error(e);
    }
  }
);
