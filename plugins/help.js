// plugins/help.js
const { cmd } = require("../command");
const config = require("../config");
const moment = require("moment");
const os = require("os");

cmd(
  {
    pattern: "help",
    alias: ["h", "info"],
    react: "❓",
    desc: "Show SUHO MD V2 help message",
    category: "main",
    filename: __filename,
  },
  async (malvin, mek, m, { from, pushname, sender }) => {
    try {
      const uptime = moment.duration(process.uptime() * 1000).humanize();
      const totalRam = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2) + " GB";
      const usedRam = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2) + " MB";
      const user = pushname || sender.split("@")[0];

      const helpText = `
╭───────────❖  *SUHO MD V2 — HELP CENTER*  ❖───────────╮

👋 Hello **${user}**,  
Welcome to **SUHO MD V2**, a fast and reliable multi-function bot  
developed and maintained by **Lord Sung**.

⚙️ *What I Can Do:*  
• Automations  
• Media Downloads  
• Group Tools  
• Fun Commands  
• Admin Utilities  
• System Monitoring  

If you ever experience issues or bugs,  
please contact **Lord Sung** directly.

─────────────────────────────────────────────
🕒 **Uptime:** ${uptime}  
💾 **Memory:** ${usedRam} / ${totalRam}  
🛎️ **Prefix:** ${config.PREFIX}  
📦 **Version:** ${config.VERSION || "2.0.0"}  
─────────────────────────────────────────────

💠 *Thank you for using SUHO MD V2*  
╰─────────────────────────────────────────────╯
`;

      await malvin.sendMessage(
        from,
        {
          image: { url: "https://files.catbox.moe/3lv5zs.jpg" }, // SUHO MD V2 banner
          caption: helpText,
        },
        { quoted: mek }
      );
    } catch (e) {
      console.error("Help Command Error:", e);
      await malvin.sendMessage(
        from,
        { text: "❌ Error while displaying help." },
        { quoted: mek }
      );
    }
  }
);