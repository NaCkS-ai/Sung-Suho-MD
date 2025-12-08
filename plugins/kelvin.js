// plugins/kelvin.js
const { cmd } = require("../command");
const config = require("../config");

cmd(
  {
    pattern: "kelvin",
    alias: ["devkelvin", "ownerkelvin"],
    react: "👑",
    desc: "Show info about Kelvin - one of NOVACORE owners",
    category: "info",
    filename: __filename,
  },
  async (malvin, mek, m, { from, pushname, sender, reply }) => {
    try {
      const caption = `
┏━━━━━━━━━━━━━━━━━━━━━┓
┃   👑 *KELVIN — Developer Profile* 👑
┗━━━━━━━━━━━━━━━━━━━━━┛

• 🔸 *Name:* Kelvin
• 🔹 *Role:* Co-Developer / Maintainer
• 🧩 *Project:* Owner of *vinic-xmd*
• ⚡ *NOVACORE:* Proud co-owner and core contributor
• 🛠️ *Speciality:* Bot development, integrations & stability
• ❤️ *Message:* "Building reliable tools — use responsibly."

━━━━━━━━━━━━━━━━━━━━━
⚡ Powered by 𝑵𝑶𝑽𝑨𝑪𝑶𝑹𝑬✟
`;

      // Thumbnail / preview (replace with Kelvin's image URL if you have one)
      const thumb = "https://files.catbox.moe/27ovis.jpg";

      // send image + caption with rich preview
      await malvin.sendMessage(
        from,
        {
          image: { url: thumb },
          caption,
          contextInfo: {
            externalAdReply: {
              title: "Kelvin — vinic-xmd",
              body: "Co-owner of NOVACORE✟ • Bot Developer",
              thumbnailUrl: thumb,
              sourceUrl: "https://github.com/Kevintech-hub" // replace with Kelvin's repo/link if available
            }
          }
        },
        { quoted: mek }
      );

      // optional short follow-up message
      await malvin.sendMessage(
        from,
        { text: "For support or collabs, contact the NOVACORE development team. (Owner contact can be added to config if needed.)" },
        { quoted: mek }
      );
    } catch (e) {
      console.error("kelvin command error:", e);
      await reply("❌ Error showing Kelvin's profile: " + e.message);
    }
  }
);
