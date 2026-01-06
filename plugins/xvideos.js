const { cmd } = require("../command");
const axios = require("axios");

cmd(
  {
    pattern: "xvideos",
    alias: ["xxvideos", "xv"],
    desc: "Download XVideos using keywords",
    category: "download",
    react: "🔞",
    filename: __filename
  },
  async (conn, mek, m, { from, text, reply }) => {
    try {
      if (!text)
        return reply(
          "❌ Please provide keywords\n\nExample:\n.xvideos stepsist"
        );

      await conn.sendMessage(from, {
        react: { text: "⏳", key: mek.key }
      });

      // API supports keyword OR URL
      const apiUrl = `https://arslan-apis.vercel.app/download/xvideosDown?url=${encodeURIComponent(
        text
      )}`;

      const { data } = await axios.get(apiUrl, {
        timeout: 60000
      });

      if (!data || !data.status || !data.result)
        return reply("❌ No video found for that keyword");

      const res = data.result;

      const caption = `
🔞 *XVIDEOS DOWNLOAD*

🎬 *Title:* ${res.title || "Unknown"}
📦 *Quality:* ${res.quality || "HD"}
📏 *Size:* ${res.size || "Unknown"}

⚡ Powered by *SUHO-MD V2*
`.trim();

      await conn.sendMessage(
        from,
        {
          video: { url: res.download },
          mimetype: "video/mp4",
          caption
        },
        { quoted: mek }
      );

    } catch (err) {
      console.error(err);
      reply("❌ Failed to fetch video");
    }
  }
);
