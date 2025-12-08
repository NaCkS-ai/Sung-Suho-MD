// plugins/tiktok.js
const { cmd } = require("../command");
const axios = require("axios");

cmd(
  {
    pattern: "tiktok",
    alias: ["tt", "tiktokdl"],
    desc: "Download TikTok videos without watermark",
    category: "downloader",
    filename: "tiktok.js",
    react: "🎵",
  },

  async (malvin, mek, m, { args, reply }) => {
    if (!args[0])
      return reply(
        "❌ Please provide a TikTok video URL!\n\nExample: .tiktok https://vt.tiktok.com/xxxx"
      );

    try {
      await reply("⏳ *Fetching TikTok video... Please wait!*");

      // API for TikTok video download
      const apiUrl = `https://api-aswin-sparky.koyeb.app/api/downloader/tiktok?url=${encodeURIComponent(
        args[0]
      )}`;
      const { data } = await axios.get(apiUrl);

      if (!data?.data?.video) {
        return reply("⚠️ Failed to fetch the TikTok video. Try again later!");
      }

      const videoUrl = data.data.video;

      // Send video with SUHO MD V2 branding
      const caption = `
┌───〔 🎬 SUHO MD V2 — TIKTOK DOWNLOADER 〕───┐

⚡ Video fetched successfully!
🔗 URL: ${args[0]}

└─────────────────────────────────────┘
🔥 Powered by *SUHO MD V2*
      `.trim();

      await malvin.sendMessage(
        m.chat,
        {
          video: { url: videoUrl },
          caption,
          fileName: "tiktok_video.mp4",
          mimetype: "video/mp4",
        },
        { quoted: mek }
      );
    } catch (error) {
      console.error("TikTok Download Error:", error);
      reply("❌ Error while downloading TikTok video!");
    }
  }
);