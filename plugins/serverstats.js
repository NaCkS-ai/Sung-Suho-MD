// plugins/serverstats.js
const { cmd } = require("../command");
const os = require("os");

cmd(
  {
    pattern: "serverstats",
    alias: ["stats", "sysstats"],
    desc: "Show server statistics",
    react: "📊",
    category: "utility",
    filename: __filename,
  },
  async (malvin, mek, m, { reply }) => {
    try {
      const platform = os.type(); // OS type
      const arch = os.arch(); // CPU architecture
      const cpu = os.cpus()[0].model; // CPU model
      const uptime = (os.uptime() / 3600).toFixed(2); // in hours
      const totalMem = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);
      const freeMem = (os.freemem() / 1024 / 1024 / 1024).toFixed(2);
      const usedMem = (totalMem - freeMem).toFixed(2);

      const stats = `
┏━━━━━━━━━━━━━━━━━━
┃ ⚡ 𝑵𝑶𝑽𝑨𝑪𝑶𝑹𝑬✟ SERVER STATS ⚡
┗━━━━━━━━━━━━━━━━━━

🖥️ Platform : ${platform} (${arch})
⚙️ CPU      : ${cpu}
⏱️ Uptime   : ${uptime} hrs

💾 Memory   : ${usedMem} GB / ${totalMem} GB
📂 Free RAM : ${freeMem} GB

━━━━━━━━━━━━━━━━━━
`;

      await reply(stats);
    } catch (e) {
      console.error("ServerStats Command Error:", e);
      reply("❌ Error while fetching server stats.");
    }
  }
);
