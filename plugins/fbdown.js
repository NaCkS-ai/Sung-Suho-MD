const { cmd } = require("../command");
const fetch = require("node-fetch");

cmd(
  {
    pattern: "fb",
    react: "📘",
    desc: "Download Facebook video",
    category: "download",
    filename: __filename,
  },
  async (malvin, mek, m, { from, args, reply }) => {
    const url = args[0];
    if (!url || !url.includes("facebook.com"))
      return reply("❌ *Please provide a valid Facebook video link.*");

    try {
      reply("🔎 Fetching Facebook video...");

      const api = `https://api.radiaa.repl.co/api/fb?url=${encodeURIComponent(url)}`;
      const response = await fetch(api);
      if (!response.ok) throw new Error("API request failed");

      const data = await response.json();
      const { hd, sd, title } = data.result;
      if (!hd && !sd) return reply("❌ Video not found or not public.");

      const videoUrl = hd || sd;

      await malvin.sendMessage(
        from,
        {
          video: { url: videoUrl },
          caption: `📘 *${title || "Facebook Video"}*\n\n_*𝑵𝑶𝑽𝑨𝑪𝑶𝑹𝑬✟ 𝙁𝘽 𝘿𝙊𝙒𝙉𝙇𝙊𝘿𝙀𝙍*_`,
        },
        { quoted: mek }
      );
    } catch (e) {
      console.error(e);
      reply(`❌ *Failed to download:* ${e.message}`);
    }
  }
);
