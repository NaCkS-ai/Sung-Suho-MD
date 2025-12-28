// plugins/ping.js
const os = require("os");
const moment = require("moment");
const Jimp = require("jimp");
const { cmd } = require("../command");

cmd(
  {
    pattern: "ping",
    alias: ["status", "uptime"],
    desc: "Check bot ping and system info with dynamic dashboard image",
    category: "main",
    react: "📶",
    filename: __filename,
    fromMe: false,
  },
  async (malvin, mek, m, { from, pushname, sender, reply }) => {
    try {
      const start = Date.now();
      await malvin.sendMessage(from, { text: "🏓 Pinging..." }, { quoted: mek });
      const end = Date.now();
      const ping = end - start;

      const uptime = moment.duration(process.uptime() * 1000).humanize();
      const totalRam = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2) + " GB";
      const usedRam = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2) + " MB";
      const cpuModel = os.cpus()[0].model;
      const cpuCores = os.cpus().length;

      // Load the base dashboard image
      const image = await Jimp.read("https://files.catbox.moe/nho7jk.jpg");

      // Prepare text to overlay
      const text = `
User      : ${pushname || sender.split("@")[0]}
Uptime    : ${uptime}
Memory    : ${usedRam} / ${totalRam}
Ping      : ${ping} ms
CPU       : ${cpuModel} (${cpuCores} cores)
`;

      // Load font
      const font = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);

      // Overlay the text onto the image
      image.print(font, 20, 20, text); // adjust x, y position as needed

      // Get buffer of the modified image
      const buffer = await image.getBufferAsync(Jimp.MIME_JPEG);

      // Send the image with caption
      await malvin.sendMessage(
        from,
        {
          image: buffer,
          caption: "📊 *Dynamic Dashboard*",
        },
        { quoted: mek }
      );
    } catch (e) {
      console.error("Ping Command Error:", e);
      await reply("❌ Unable to fetch dynamic ping/status.");
    }
  }
);
