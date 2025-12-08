// plugins/tohitam.js
const axios = require("axios");
const { cmd } = require("../command");
const { uploader } = require("../lib/uploader");

cmd(
  {
    pattern: "tohitam",
    alias: ["blackfilter", "hitam", "hitamkan"],
    desc: "Convert an image into a black-filter version",
    category: "maker",
    filename: __filename,
  },
  async (malvin, mek, m, { reply }) => {
    try {
      const q = m.quoted ? m.quoted : m;
      const mime = (q.msg || q).mimetype || "";

      if (!mime || !/image\/(jpeg|png|jpg)/.test(mime)) {
        return reply(
          "🖼️ Please reply to or send an *image (JPG/PNG)* with the command!\n\nExample:\n.tohitam"
        );
      }

      await malvin.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });

      const media = await q.download();
      if (!media) return reply("❌ Failed to download the image, try again.");

      const uploaded = await uploader(media).catch(() => null);
      if (!uploaded) return reply("⚠️ Failed to upload your image, please try again later.");

      const apiUrl = `https://izumiiiiiiii.dpdns.org/ai-image/hytamkan?imageUrl=${encodeURIComponent(uploaded)}`;

      const res = await axios.get(apiUrl);
      if (!res.data || !res.data.result || !res.data.result.download) {
        return reply("❌ API didn’t return a valid result.");
      }

      const imageUrl = res.data.result.download;
      const imgRes = await axios.get(imageUrl, { responseType: "arraybuffer" });

      await malvin.sendMessage(
        m.chat,
        {
          image: imgRes.data,
          caption: `🎨 *Image successfully converted!*\n\n🖤 Filter: Black\n✨ Powered by NovaCore AI`,
        },
        { quoted: mek }
      );
    } catch (err) {
      console.error("tohitam.js error:", err);
      reply(`⚠️ An error occurred: ${err.message}`);
    } finally {
      await malvin.sendMessage(m.chat, { react: { text: "", key: m.key } });
    }
  }
);
