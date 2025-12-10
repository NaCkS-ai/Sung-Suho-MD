// plugins/live.js
const { cmd } = require("../command");
const os = require("os");
const moment = require("moment");
const config = require("../config");

cmd(
  {
    pattern: "live",
    alias: ["alive2", "status"],
    desc: "Show clean alive message",
    category: "main",
    filename: __filename,
    react: "⚡",
  },
  async (malvin, mek, m, { from, pushname, sender, reply }) => {
    try {
      const uptime = moment.duration(process.uptime() * 1000).humanize();
      const totalRam = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);
      const usedRam = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
      const user = pushname || sender.split("@")[0];

      const liveText = `
╭───────────────────────────────────╮
│ **SUHO MD V2 — Live Status** ⚡
│ _System is running smoothly_
╰───────────────────────────────────╯

**👤 User:** \`${user}\`
**👑 Owner:** \`${config.OWNER_NUMBER}\`
**🕒 Uptime:** \`${uptime}\`
**💾 Memory:** \`${usedRam} MB / ${totalRam} GB\`
**🛎️ Prefix:** \`${config.PREFIX}\`
**📦 Version:** \`${config.VERSION || "2.0.0"}\`

> 🟢 **Status:** Online & Fully Operational
`;

      await malvin.sendMessage(
        from,
        {
          text: liveText.trim(),
          contextInfo: {
            externalAdReply: {
              title: "SUHO MD V2 — Status Panel",
              body: "Styled like a Discord embed ⚡",
              thumbnailUrl: "https://files.catbox.moe/3lv5zs.jpg",
              mediaType: 1,
              renderLargerThumbnail: true,
            },
          },
        },
        { quoted: mek }
      );
    } catch (e) {
      console.error(e);
      reply("❌ Error in live command:\n" + e.message);
    }
  }
);