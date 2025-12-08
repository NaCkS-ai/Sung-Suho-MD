// plugins/ytvideo.js
const { cmd } = require("../command");
const yts = require("yt-search");
const axios = require("axios");

cmd(
  {
    pattern: "video",
    react: "🎥",
    desc: "Download YouTube Video",
    category: "download",
    filename: __filename,
  },
  async (malvin, mek, m, { from, args, reply }) => {
    try {
      const q = args.join(" ");
      if (!q) return reply("⚡ *Enter a song name or YouTube link!*");

      // 🔍 Find the URL
      let url = q;
      try {
        url = new URL(q).toString();
      } catch {
        const s = await yts(q);
        if (!s.videos.length) return reply("❌ No results found in the NovaCore system!");
        url = s.videos[0].url;
      }

      // 📊 Send metadata + thumbnail
      const info = (await yts(url)).videos[0];
      const desc = `
━━━━━━━━━━━━━━━━━━
🚀 *NovaCore Video Downloader* 🚀
━━━━━━━━━━━━━━━━━━

📌 *Title:* ${info.title}
📝 *Description:* ${info.description || "No description"}
⏱️ *Duration:* ${info.timestamp}
👀 *Views:* ${info.views}
📅 *Uploaded:* ${info.ago} ago

🔗 *URL:* ${info.url}

━━━━━━━━━━━━━━━━━━
💠 *Powered By:* 𝑵𝑶𝑽𝑨𝑪𝑶𝑹𝑬✟
━━━━━━━━━━━━━━━━━━
      `.trim();

      await malvin.sendMessage(
        from,
        { image: { url: info.thumbnail }, caption: desc },
        { quoted: mek }
      );

      // 📥 Video download helper
      const downloadVideo = async (videoUrl, quality = "720") => {
        const apiUrl = `https://p.oceansaver.in/ajax/download.php?format=${quality}&url=${encodeURIComponent(
          videoUrl
        )}&api=dfcb6d76f2f6a9894gjkege8a4ab232222`;

        const res = await axios.get(apiUrl);
        if (!res.data.success) throw new Error("NovaCore failed to fetch download details.");

        const { id, title } = res.data;
        const progressUrl = `https://p.oceansaver.in/ajax/progress.php?id=${id}`;

        while (true) {
          const prog = (await axios.get(progressUrl)).data;
          if (prog.success && prog.progress === 1000) {
            const vid = await axios.get(prog.download_url, { responseType: "arraybuffer" });
            return { buffer: vid.data, title };
          }
          await new Promise((r) => setTimeout(r, 5000)); // wait 5s
        }
      };

      // 🎥 Download + Send
      const { buffer, title } = await downloadVideo(url, "720");
      await malvin.sendMessage(
        from,
        {
          video: buffer,
          mimetype: "video/mp4",
          caption: `🎥 *${title}*\n\n⚡ 𝑵𝑶𝑽𝑨𝑪𝑶𝑹𝑬✟ | All Rights Reserved`,
        },
        { quoted: mek }
      );

      reply("✅ Video successfully delivered by NovaCore System!");
    } catch (e) {
      console.error(e);
      reply(`❌ *NovaCore Error:* ${e.message}`);
    }
  }
);
