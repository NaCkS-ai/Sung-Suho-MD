// plugins/nova.js
const { cmd } = require("../command");

cmd(
  {
    pattern: "novacore",
    react: "⚡",
    desc: "Shows info about NOVACORE bot and developers",
    category: "info",
    filename: __filename,
  },
  async (malvin, mek, m, { from, reply }) => {
    try {
      const message = `
⚡ *NOVACORE Mini Bot*

🖤 *About:*
NOVACORE is a fast, reliable, and feature-rich WhatsApp mini bot designed to make your life easier. It comes with fun commands, utilities, moderation tools, and interactive features.

👨‍💻 *Developers:*
- Dev Sung
- Kelvin Tech

🌐 *Powered by:* 𝑵𝑶𝑽𝑨𝑪𝑶𝑹𝑬✟
📌 *Features include:* Anime pics, memes, quotes, games, moderation tools, Spotify, deepseek, and more.

💌 *Support / Contact:* Report any issues directly to the developers.

🎌 *Stay tuned for updates and new features!*`;

      await malvin.sendMessage(
        from,
        { text: message },
        { quoted: mek }
      );
    } catch (e) {
      console.error(e);
      reply("❌ Failed to fetch NOVACORE info. Try again later.");
    }
  }
);