// plugins/nova.js
const { cmd } = require("../command");
const axios = require("axios");

cmd(
  {
    pattern: "nova",
    react: "🤖",
    desc: "Chat with NOVACORE AI",
    category: "ai",
    filename: __filename,
  },
  async (malvin, mek, m, { from, args, reply }) => {
    try {
      const q = args.join(" ");
      if (!q) return reply("❌ Please provide a question. Example: `.nova who created you?`");

      // Example free AI API (you can swap with a premium one)
      const res = await axios.get(`https://api.affiliateplus.xyz/api/chatbot`, {
        params: {
          message: q,
          botname: "NOVACORE✟",
          ownername: "Dev Sung & Kelvin Tech",
          user: from,
        },
      });

      const answer = res.data.message;

      await malvin.sendMessage(
        from,
        {
          text: `🤖 *NOVACORE✟ AI*\n\n${answer}`,
        },
        { quoted: mek }
      );
    } catch (e) {
      console.error(e);
      reply("❌ Error while fetching AI response.");
    }
  }
);
