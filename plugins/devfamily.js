// plugins/devfamily.js
const { cmd } = require("../command");

cmd(
  {
    pattern: "devfamily",
    alias: ["devs", "family"],
    desc: "Show the Dev Family list",
    category: "main",
    filename: __filename,
    react: "👨‍👩‍👦",
  },
  async (malvin, mek, m, { from, reply }) => {
    try {
      const devList = `
┏━━━━━━━━━━━━━━━━━━━┓
┃    👨‍💻 *DEV FAMILY* 👨‍💻
┗━━━━━━━━━━━━━━━━━━━┛

1. Sung (Founder)
2. Kelvin (Co-Dev)
3. Malvin King (Lead Dev)
4. Tristan (Support Dev)
5. Archer (Support Dev)

⚡ Proudly powering 𝑵𝑶𝑽𝑨𝑪𝑶𝑹𝑬✟ ⚡
      `;

      await malvin.sendMessage(
        from,
        {
          text: devList,
          contextInfo: {
            externalAdReply: {
              title: "𝑵𝑶𝑽𝑨𝑪𝑶𝑹𝑬✟ Dev Family",
              body: "Meet the brilliant minds behind the bot 🚀",
              thumbnailUrl: "https://files.catbox.moe/27ovis.jpg",
              sourceUrl: "https://github.com/", // put your repo link if you want
              mediaType: 1,
              renderLargerThumbnail: true
            }
          }
        },
        { quoted: mek }
      );
    } catch (e) {
      console.error(e);
      reply("❌ Error showing Dev Family:\n" + e.message);
    }
  }
);
