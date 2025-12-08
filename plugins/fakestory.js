// plugins/fakestory.js
const axios = require("axios");
const { cmd } = require("../command");
const { getBuffer } = require("../lib/functions");
const FormData = require("form-data");
const fs = require("fs");

cmd(
  {
    pattern: "fakestory",
    alias: ["fakestoryig", "igstory"],
    desc: "Create a fake Instagram story with username and caption",
    category: "maker",
    filename: __filename,
  },
  async (malvin, mek, m, { args, reply, q }) => {
    try {
      if (!args[0])
        return reply(
          `🌸 *Wrong format!*\nUse: *.fakestory username|caption*\n\n💡 Example: *.fakestory NovaCore|Living my best life 💫*`
        );

      // Get quoted image or self image
      const quoted = m.quoted ? m.quoted : mek;
      const mime =
        (quoted.message?.imageMessage?.mimetype ||
          quoted.msg?.mimetype ||
          "") || "";
      if (!/image\/(jpe?g|png)/.test(mime)) {
        return reply(
          "🖼️ *Please reply to or send an image (JPG/PNG) with this command!*"
        );
      }

      // React ⏳
      await malvin.sendMessage(m.chat, { react: { text: "⏳", key: mek.key } });

      const [username, caption] = args.join(" ").split("|");
      if (!username || !caption)
        return reply(
          `❌ *Invalid format!*\nUse: *.fakestory username|caption*\n\nExample: *.fakestory NovaCore|Living my best life 💫*`
        );

      // Download image buffer
      const mediaMsg = quoted.message.imageMessage || quoted.msg;
      const mediaBuffer = await downloadMedia(malvin, mediaMsg);
      if (!mediaBuffer) return reply("🍂 *Failed to download image!*");

      // Upload to catbox
      const uploadedUrl = await uploadToCatbox(mediaBuffer);
      if (!uploadedUrl) return reply("❌ *Failed to upload image, try again.*");

      // Request FakeStory API
      const apiUrl = `https://api.zenzxz.my.id/maker/fakestory?username=${encodeURIComponent(
        username
      )}&caption=${encodeURIComponent(caption)}&ppurl=${encodeURIComponent(
        uploadedUrl
      )}`;

      const response = await axios.get(apiUrl, {
        responseType: "arraybuffer",
        timeout: 25000,
      });

      if (!response.data) return reply("❌ *Failed to fetch FakeStory image.*");

      const resultBuffer = Buffer.from(response.data);

      // Send the generated story
      await malvin.sendMessage(
        m.chat,
        {
          image: resultBuffer,
          caption:
            `✨ *Fake Instagram Story Created!*\n\n👤 *Username:* ${username}\n📝 *Caption:* ${caption}\n\n🧠 Powered by *NovaCore AI*`,
        },
        { quoted: mek }
      );
    } catch (err) {
      console.error("FakeStory Error:", err);
      reply(`⚠️ *Error:* ${err.message || "Something went wrong."}`);
    } finally {
      await malvin.sendMessage(m.chat, { react: { text: "", key: mek.key } });
    }
  }
);

// ====== Helper functions ======

async function downloadMedia(malvin, msg) {
  try {
    const buffer = await malvin.downloadMediaMessage(msg);
    return buffer;
  } catch {
    return null;
  }
}

async function uploadToCatbox(buffer) {
  try {
    const form = new FormData();
    form.append("reqtype", "fileupload");
    form.append("fileToUpload", buffer, { filename: "upload.jpg" });

    const res = await axios.post("https://catbox.moe/user/api.php", form, {
      headers: form.getHeaders(),
      timeout: 20000,
    });

    return res.data.includes("https")
      ? res.data.trim()
      : null;
  } catch {
    return null;
  }
}
