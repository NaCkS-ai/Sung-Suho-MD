const { cmd } = require("../command");

cmd(
  {
    pattern: "alive",
    react: "🤖",
    desc: "Show bot status",
    category: "main",
    filename: __filename,
    fromMe: false,
  },
  async (malvin, mek, m, { reply }) => {
    try {
      const from = mek.key.remoteJid;

      await malvin.sendPresenceUpdate("recording", from);

      // Alive Image & Caption
      await malvin.sendMessage(
        from,
        {
          image: {
            url: "https://files.catbox.moe/3lv5zs.jpg",
          },
          caption: `╔══ ❖ 𝐒𝐔𝐇𝐎 𝐌𝐃 𝐕𝟐 ❖ ══╗
      ⚡ *System Online & Stable* ⚡
╚════════════════════════════╝

📡 *Status*      : Running Smoothly  
🧩 *Framework*   : SUHO Engine V2  
👑 *Developer*   : Lord Sung  

─────────────────────────
📢 *WhatsApp Channel*  
https://whatsapp.com/channel/0029VbB3YxTDJ6H15SKoBv3S  

💻 *Source Code*  
https://github.com/NaCkS-ai/Sung-Suho-MD
─────────────────────────

⚠️ *Notice*  
Use the bot responsibly.  
We take no liability for misuse.

╔═══════════════════════╗
        🔥 *SUHO MD — NEXT GEN BOT* 🔥
╚═══════════════════════╝`,
        },
        { quoted: mek }
      );

      // Delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Voice Message
      await malvin.sendMessage(
        from,
        {
          audio: {
            url: "https://files.catbox.moe/wz8rh7.mp3",
          },
          mimetype: "audio/mpeg",
          ptt: true,
        },
        { quoted: mek }
      );
    } catch (e) {
      console.error("❌ Error in .alive command:", e);
      reply("❌ Error while sending alive message!");
    }
  }
);