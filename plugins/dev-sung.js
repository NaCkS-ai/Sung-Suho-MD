// plugins/dev-sung.js
const { cmd } = require("../command");
const config = require("../config");

cmd(
  {
    pattern: "dev-sung",
    alias: ["sung", "devsung", "founder"],
    react: "🛠️",
    desc: "Show info about Dev Sung — founder & main developer of NOVACORE",
    category: "info",
    filename: __filename,
  },
  async (malvin, mek, m, { from, reply }) => {
    try {
      const caption = `
┏━━━━━━━━━━━━━━━━━━━━━┓
┃   🛡️ *DEV SUNG — FOUNDER PROFILE* 🛡️
┗━━━━━━━━━━━━━━━━━━━━━┛

• 🔸 *Name:* Dev Sung
• 🔹 *Role:* Founder & Main Developer
• ⭐ *Projects:*
   - Suho MD
   - Suho Mini
   - Novacore Mini
   - Cyberia-MD
   - Sungsu-cpanel
• ⚡ *NOVACORE:* Proud main developer & founder of SUHO-MD V2✟
• 🛠️ *Expertise:* Bot architecture, integrations, stability, and tooling
• 💬 *Note:* For support, collaboration or reporting issues, contact the NOVACORE development team.

━━━━━━━━━━━━━━━━━━━━━
⚡ Powered by 𝑵𝑶𝑽𝑨𝑪𝑶𝑹𝑬✟
`.trim();

      // Use a default image if none set in config
      const thumb = config.DEV_SUNG_IMAGE || "https://files.catbox.moe/2w9eoh.jpg";

      // Send image + caption with rich preview if supported
      await malvin.sendMessage(
        from,
        {
          image: { url: thumb },
          caption,
          contextInfo: {
            externalAdReply: {
              title: "Dev Sung — Founder of NOVACORE✟",
              body: "Main Developer • Creator of multiple MD frameworks",
              thumbnailUrl: thumb,
              sourceUrl: config.DEV_SUNG_URL || undefined
            }
          }
        },
        { quoted: mek }
      );

      // Optional short follow-up message
      await malvin.sendMessage(
        from,
        {
          text:
            "📝 If you'd like to reach out to Dev Sung or the NOVACORE team, ask the owner to add contact details to config.js (DEV_SUNG_CONTACT)."
        },
        { quoted: mek }
      );
    } catch (e) {
      console.error("dev-sung command error:", e);
      // use reply fallback if available
      try {
        await reply("❌ Error showing Dev Sung's profile: " + (e.message || e));
      } catch {
        // last-resort console log if reply fails
        console.error("Also failed to send reply message.");
      }
    }
  }
);
