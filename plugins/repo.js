const { cmd } = require("../command");
const config = require("../config");

// Suho MD V2 – Fake vCard Branding
const fakevCard = {
  key: {
    fromMe: false,
    participant: "0@s.whatsapp.net",
    remoteJid: "status@broadcast",
  },
  message: {
    contactMessage: {
      displayName: "© SUHO MD V2",
      vcard: `BEGIN:VCARD
VERSION:3.0
FN:Suho-MD V2
ORG:SUHO MD PROJECT;
TEL;type=CELL;type=VOICE;waid=00000000000:+00000000000
END:VCARD`,
    },
  },
};

cmd(
  {
    pattern: "repo",
    alias: ["source", "github"],
    react: "📦",
    desc: "Get the official Suho MD V2 GitHub repository",
    category: "main",
    filename: __filename,
  },

  async (malvin, mek, m, { reply, from }) => {
    try {
      const caption = `
┌───〔 🔗 *SUHO MD V2 — GITHUB REPO* 〕───┐

📁 Repository:
${config.REPO || "⚠️ Repo not configured in config.js"}

⭐ Star & 🍴 Fork the project  
to support Suho MD V2 development!

└─────────────────────────────────┘
🔥 Powered by *SUHO MD V2*
      `.trim();

      await malvin.sendMessage(
        from,
        {
          image: { url: "https://files.catbox.moe/3lv5zs.jpg" }, 
          caption,
        },
        { quoted: fakevCard }
      );
    } catch (e) {
      console.error("Repo Command Error:", e);
      reply("❌ Unable to fetch Suho MD V2 repo info.");
    }
  }
);