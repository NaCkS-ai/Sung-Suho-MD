// plugins/imageurl.js
const { cmd } = require("../command");
const { downloadContentFromMessage } = require("@whiskeysockets/baileys");
const axios = require("axios");

cmd(
  {
    pattern: "imageurl",
    desc: "Upload image to get its URL",
    category: "tools",
    react: "📸",
    filename: __filename,
    fromMe: false,
  },
  async (malvin, mek, m, { quoted, reply }) => {
    try {
      // Check if the user has replied to an image
      if (!quoted || !quoted.message.imageMessage) {
        return reply("❌ Please reply to an image to get the URL.");
      }

      // Download the image as buffer
      const stream = await downloadContentFromMessage(quoted.message.imageMessage, "image");
      let buffer = Buffer.from([]);
      for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk]);
      }

      // Upload the image using imgBB API
      const form = new FormData();
      form.append("file", buffer, { filename: "image.jpg", contentType: "image/jpeg" });

      const response = await axios.post("https://api.imgbb.com/1/upload?key=87aec8ffa13473e9eb6cbfd0ffd309ba", form, {
        headers: form.getHeaders(),
      });

      if (response.data && response.data.data && response.data.data.url) {
        reply(`Here's the URL of the image:\n${response.data.data.url}`);
      } else {
        reply("❌ Failed to upload image.");
      }
    } catch (e) {
      console.error(e);
      reply("❌ An error occurred while processing the image.");
    }
  }
);
