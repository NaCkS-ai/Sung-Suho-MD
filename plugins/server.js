// plugins/server.js
const { cmd } = require("../command");
const os = require("os");
const moment = require("moment");

cmd(
  {
    pattern: "server",
    alias: ["sysinfo", "system"],
    desc: "Show server/system information",
    category: "main",
    filename: __filename,
    react: "🖥️",
  },
  async (malvin, mek, m, { from, reply }) => {
    try {
      // Server Info
      const uptime = moment.duration(os.uptime() * 1000).humanize();
      const totalRam = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);
      const freeRam = (os.freemem() / 1024 / 1024 / 1024).toFixed(2);
      const usedRam = (totalRam - freeRam).toFixed(2);
      const cpu = os.cpus()[0].model;
      const platform = os.type() + " " + os.release();

      const sysInfo = `
┏━━━━━━━━━━━━━━━━━━━┓
┃   🖥️ *SERVER INFO* 🖥️
┗━━━━━━━━━━━━━━━━━━━┛

📌 Platform : ${platform}
🕒 Uptime   : ${uptime}
💾 RAM      : ${usedRam} GB / ${totalRam} GB
⚡ CPU      : ${cpu}
🛠️ Node.js  : ${process.version}

⚡ Powered by 𝑵𝑶𝑽𝑨𝑪𝑶𝑹𝑬✟ ⚡
`;

      await malvin.sendMessage(
        from,
        {
          text: sysInfo,
          contextInfo: {
            externalAdReply: {
              title: "Server Status",
              body: "Bot is running smoothly 🚀",
              thumbnailUrl: "https://files.catbox.moe/27ovis.jpg", // bot image
              mediaType: 1,
              renderLargerThumbnail: true,
            },
          },
        },
        { quoted: mek }
      );
    } catch (e) {
      console.error(e);
      reply("❌ Error fetching server info:\n" + e.message);
    }
  }
);
