// plugins/animepic.js
const { cmd } = require("../command");
const axios = require("axios");

cmd(
  {
    pattern: "animepic",
    react: "🎌",
    desc: "Get a random anime picture",
    category: "fun",
    filename: __filename,
  },
  async (malvin, mek, m, { from, reply }) => {
    try {
      // Using Nekos API for anime images
      const res = await axios.get("https://nekos.life/api/v2/img/neko");
      const imgUrl = res.data.url;

      await malvin.sendMessage(
        from,
        {
          image: { url: imgUrl },
          caption: `🎌 *Here’s your random anime picture!*  
⚡ Powered by 𝑵𝑶𝑽𝑨𝑪𝑶𝑹𝑬✟`,
        },
        { quoted: mek }
      );
    } catch (e) {
      console.error(e);
      reply("❌ Failed to fetch anime picture. Try again later.");
    }
  }
);