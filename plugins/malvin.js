// plugins/malvin.js
const { cmd } = require("../command");
const config = require("../config");

cmd(
  {
    pattern: "malvin",
    alias: ["devmalvin", "malvin-king"],
    react: "👑",
    desc: "Show info about Malvin King — core developer & owner of Malvin projects",
    category: "info",
    filename: __filename,
  },
  async (malvin, mek, m, { from, reply }) => {
    try {
      const caption = `
┏━━━━━━━━━━━━━━━━━━━━━┓
┃   👑 *MALVIN KING — MASTER DEV* 👑
┗━━━━━━━━━━━━━━━━━━━━━┛

• 🔸 *Name:* Malvin King
• 🔹 *Role:* Lead Developer / Visionary Mind
• ⭐ *Projects:*
   - Malvin XD
   - Jinwoo
   - Jinwoo-v4
   - Malvin Mini
   - Star XD
   - And many more innovative bots!
• ⚡ *NOVACORE:* One of the proud core developers behind 𝑵𝑶𝑽𝑨𝑪𝑶𝑹𝑬✟
• 🛠️ *Known For:* Creativity, stability, unique features & bot ecosystems
• 💬 *Note:* Widely respected as one of the best bot developers of his era.

━━━━━━━━━━━━━━━━━━━━━
⚡ Powered by 𝑵𝑶𝑽𝑨𝑪𝑶𝑹𝑬✟
`.trim();

      // Use custom Malvin image if set in config
      const thumb = config.DEV_MALVIN_IMAGE || "https://files.catbox.moe/27ovis.jpg";

      await malvin.sendMessage(
        from,
        {
          image: { url: thumb },
          caption,
          contextInfo: {
            externalAdReply: {
              title: "Malvin King — Mastermind Behind NOVACORE✟",
              body: "Owner of Malvin XD, Jinwoo, Star XD, and more.",
              thumbnailUrl: thumb,
              sourceUrl: config.DEV_MALVIN_URL || undefined
            }
          }
        },
        { quoted: mek }
      );

      // Optional footer message
      await malvin.sendMessage(
        from,
        { text: "👑 Respect the legacy of Malvin King — a legend in the bot world." },
        { quoted: mek }
      );
    } catch (e) {
      console.error("malvin command error:", e);
      try {
        await reply("❌ Error showing Malvin King's profile: " + (e.message || e));
      } catch {}
    }
  }
);
