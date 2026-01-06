const { cmd } = require("../command");
const axios = require("axios");

const NEBULA_API_KEY = "nebula_65e5772e";

cmd(
  {
    pattern: "nsfwai",
    desc: "Generate NSFW AI image using Nebula API",
    category: "nsfw",
    react: "🖼️",
    filename: __filename
  },
  async (conn, mek, m, { from, text, reply }) => {
    try {
      if (!text)
        return reply(
          "❌ Please provide a prompt\n\nExample:\n.nsfwai anime girl"
        );

      await conn.sendMessage(from, {
        react: { text: "⏳", key: mek.key }
      });

      const url = "https://nebulabot-stats.onrender.com/coderxsa/nsfw-ai-img";

      const response = await axios.get(url, {
        headers: {
          "x-api-key": NEBULA_API_KEY
        },
        params: {
          prompt: text
        },
        responseType: "arraybuffer",
        timeout: 60000
      });

      if (!response.data)
        return reply("❌ Failed to generate image");

      const buffer = Buffer.from(response.data);

      await conn.sendMessage(
        from,
        {
          image: buffer,
          caption: `🖼️ *Nebula AI Generated*\n\n📝 Prompt: ${text}\n⚡ SUHO-MD V2`
        },
        { quoted: mek }
      );

    } catch (err) {
      console.error("Nebula AI Error:", err?.response?.data || err.message);
      reply("❌ Error generating image from Nebula API");
    }
  }
);
