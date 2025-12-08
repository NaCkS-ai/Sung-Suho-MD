const { cmd } = require("../command");
const config = require("../config");

// Fake vCard (Suho MD V2)
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
FN:Suho MD V2
ORG:SUHO AI;
TEL;type=CELL;type=VOICE;waid=13135550002:+13135550002
END:VCARD`,
    },
  },
};

cmd(
  {
    pattern: "version",
    alias: ["ver", "about"],
    react: "⚙️",
    desc: "Check bot version info",
    category: "main",
    filename: __filename,
  },
  async (malvin, mek, m, { reply, from }) => {
    try {
      // ASCII-style banner
      const banner = `
███████╗██╗   ██╗██╗  ██╗ ██████╗ 
██╔════╝██║   ██║██║ ██╔╝██╔═══██╗
█████╗  ██║   ██║█████╔╝ ██║   ██║
██╔══╝  ██║   ██║██╔═██╗ ██║   ██║
██║     ╚██████╔╝██║  ██╗╚██████╔╝
╚═╝      ╚═════╝ ╚═╝  ╚═╝ ╚═════╝

       ⚡ SUHO MD V2 ⚡
`;

      const caption = `
${banner}

╭───❮ ⚙️ 𝗕𝗢𝗧 𝗩𝗘𝗥𝗦𝗜𝗢𝗡 ❯───
│ 🤖 *Bot:* SUHO MD V2
│ 📌 *Version:* ${config.VERSION || "1.0.0"}
│ 🛠️ *Prefix:* ${config.PREFIX || "."}
│ 👑 *Owner:* ${config.OWNER_NAME || "Unknown"}
╰─────────────────────────

> 🚀 Powered by *SUHO MD V2*
      `.trim();

      await malvin.sendMessage(
        from,
        {
          image: { url: "https://i.ibb.co/SDWZFh23/malvin-xd.jpg" }, // optional banner image
          caption,
        },
        { quoted: fakevCard }
      );
    } catch (e) {
      console.error("Version Command Error:", e);
      reply("❌ Failed to fetch version info.", fakevCard);
    }
  }
);