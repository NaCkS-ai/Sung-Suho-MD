// plugins/tofigure.js
const axios = require("axios");
const FormData = require("form-data");
const { cmd } = require("../command"); // ✅ NovaCore cmd handler

cmd({
  pattern: "tofigure",
  alias: ["figureai", "figure"],
  desc: "Turn an image into an anime-style figure using AI",
  category: "ai",
  filename: __filename
}, async (conn, m, msg, { reply }) => {
  try {
    const q = m.quoted ? m.quoted : m;
    const mime = (q.msg || q).mimetype || "";

    if (!mime.startsWith("image/")) 
      return reply("📸 Please reply to or send an image to convert.");

    await reply("🧠 Processing your image... please wait a moment!");

    const buffer = await q.download();
    if (!buffer) return reply("⚠️ Failed to download image.");

    // Upload image to Uguu.se
    const form = new FormData();
    form.append("files[]", buffer, { filename: "image.jpg" });

    const upload = await axios.post("https://uguu.se/upload.php", form, {
      headers: form.getHeaders(),
      timeout: 60000,
    });

    const uploadedUrl = upload.data.files?.[0]?.url;
    if (!uploadedUrl) return reply("⚠️ Upload failed, try again later.");

    // Convert to anime figure using Nekolabs API
    const apiUrl = `https://api.nekolabs.my.id/tools/convert/tofigure?imageUrl=${encodeURIComponent(uploadedUrl)}`;
    const res = await axios.get(apiUrl, { timeout: 60000 });

    const result = res.data?.result;
    if (!result) return reply("⚠️ Failed to generate the figure. Try again later.");

    await conn.sendMessage(
      m.chat,
      {
        image: { url: result },
        caption: "✨ *Here’s your AI-generated figure!* — NovaCore AI",
      },
      { quoted: m }
    );
  } catch (e) {
    console.error(e);
    reply(`❌ Error: ${e.message || "Unexpected error occurred."}`);
  }
});
