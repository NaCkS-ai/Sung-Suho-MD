// plugins/ping.js
const os = require("os");
const moment = require("moment");
const { cmd } = require("../command");
const config = require("../config");

cmd(
  {
    pattern: "ping",
    alias: ["status", "uptime"],
    desc: "Show system dashboard with stats",
    category: "main",
    react: "📊",
    filename: __filename,
    fromMe: false,
  },
  async (malvin, mek, m, { from, pushname, sender, reply }) => {
    try {
      const start = Date.now();
      await malvin.sendMessage(from, { text: "⏳ Fetching system stats..." }, { quoted: mek });
      const end = Date.now();
      const latency = (end - start).toFixed(2);

      const uptime = moment.duration(process.uptime() * 1000).humanize();
      const totalRam = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);
      const usedRam = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);

      const cpuModel = os.cpus()[0].model;
      const cpuUsage = Math.floor(Math.random() * 50) + 10; // mock CPU usage %
      const diskTotal = 196.74; // mock total disk GB
      const diskUsed = 176.03;  // mock used disk GB
      const networkDown = 22.83; // MB
      const networkUp = 7.87;    // MB

      const caption = `
🖥️ *SYSTEM DASHBOARD*

👤 User       : ${pushname || sender.split("@")[0]}
🕒 Uptime     : ${uptime}
⏱️ Latency    : ${latency}ms

💻 CPU        : ${cpuModel}
⚡ CPU Usage  : ${cpuUsage}%
💾 RAM        : ${usedRam} GB / ${totalRam} GB
🗄️ Disk       : ${diskUsed} GB / ${diskTotal} GB
🌐 Network    : ↓ ${networkDown} MB ↑ ${networkUp} MB

────────────────────────
⚡ Powered by *${config.OWNER_NAME || "LORD SUNG"}*
      `;

      await malvin.sendMessage(
        from,
        {
          image: { url: "https://files.catbox.moe/6ea5p3.jpg" }, // your dashboard image
          caption: caption.trim(),
        },
        { quoted: mek }
      );
    } catch (e) {
      console.error("Ping Command Error:", e);
      await reply("❌ Unable to fetch system stats. Try again later.");
    }
  }
);
