// plugins/play.js
const axios = require("axios");
const { cmd } = require("../command");

cmd(
  {
    pattern: "play",
    alias: ["song1", "ytplay"],
    desc: "Play music from YouTube",
    category: "downloader",
    filename: __filename,
  },
  async (malvin, mek, m, { args, reply }) => {

    const text =
      (args && args.length ? args.join(" ") : null) ||
      (m?.quoted?.text ? m.quoted.text : null);

    if (!text)
      return reply("❌ *Please enter a song name!*\n\nExample: `.play Alone`");

    try {
      await reply("🎧 **Searching your track…**\nPlease wait a moment.");

      const apiUrl = `https://api.privatezia.biz.id/api/downloader/ytplaymp3?query=${encodeURIComponent(
        text
      )}`;

      const res = await axios.get(apiUrl, { timeout: 60000 });
      const data = res.data;

      if (!data || data.status === false || !data.result) {
        return reply("❌ *No results found for that song.*");
      }

      const result = data.result;
      const audioUrl = result.downloadUrl;

      if (!audioUrl)
        return reply("❌ *Audio link missing from API response.*");

      const title = result.title || text;
      const duration = result.duration ? `${result.duration}s` : "Unknown";
      const thumbnail =
        result.thumbnail ||
        (result.videoId ? `https://img.youtube.com/vi/${result.videoId}/hqdefault.jpg` : null) ||
        "https://i.ibb.co/4pDNDk1/music.jpg";

      // Premium SUHO MD V2 Music Embed
      const caption = `
╔════════════════════════════╗
      🎶 SUHO MD V2 — MUSIC PLAYER
╚════════════════════════════╝

🎵 **Title:** ${title}
⏱️ **Duration:** ${duration}
📺 **YouTube:** ${result.videoUrl || "N/A"}

────────────────────────────
▶️ *Your track is ready!*  
Enjoy high-quality playback with **SUHO MD V2**.
────────────────────────────
`;

      // Send song info with thumbnail
      await malvin.sendMessage(
        m.chat,
        {
          image: { url: thumbnail },
          caption,
        },
        { quoted: mek }
      );

      // Send MP3 audio
      await malvin.sendMessage(
        m.chat,
        {
          audio: { url: audioUrl },
          mimetype: "audio/mpeg",
          fileName: `${title}.mp3`,
        },
        { quoted: mek }
      );

    } catch (err) {
      console.error("play.js error:", err.message);
      reply(`⚠️ *Error fetching song:* ${err.message}`);
    }
  }
);