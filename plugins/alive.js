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

      // Set bot status as recording
      await malvin.sendPresenceUpdate("recording", from);

      // Alive Image & Caption
      const caption = `
\`╔════════════════════════╗\`
\`║     ⚡ 𝐒𝐔𝐇𝐎 𝐌𝐃 𝐕2 ⚡     ║\`
\`╚════════════════════════╝\`

📡 \`Status      :\` Running Smoothly
🧩 \`Framework  :\` SUHO Engine V2
👑 \`Developer  :\` Lord Sung

─────────────────────────

📢 \`WhatsApp Channel:\`
https://whatsapp.com/channel/0029VbB3YxTDJ6H15SKoBv3S

💻 \`Source Code:\`
https://github.com/NaCkS-ai/Sung-Suho-MD

─────────────────────────

⚠️ \`Notice:\` Use responsibly. We take no liability for misuse.

\`╔════════════════════════╗\`
\`║   🔥 SUHO MD — NEXT GEN BOT 🔥   ║\`
\`╚════════════════════════╝\`
      `;

      await malvin.sendMessage(
        from,
        {
          image: { url: "https://files.catbox.moe/nho7jk.jpg" },
          caption,
        },
        { quoted: mek }
      );

      // Optional delay for natural timing
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Send voice message
      await malvin.sendMessage(
        from,
        {
          audio: { url: "https://files.catbox.moe/wz8rh7.mp3" },
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