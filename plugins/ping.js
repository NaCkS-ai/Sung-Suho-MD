const { cmd } = require("../command");

// SUHO MD V2 vCard (premium clean)
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
FN:SUHO MD V2
ORG:Lord Sung Network;
TEL;type=CELL;type=VOICE;waid=13135550002:+13135550002
END:VCARD`,
    },
  },
};

cmd(
  {
    pattern: "ping",
    desc: "Check bot latency",
    react: "🖥️",
    category: "utility",
    filename: __filename,
  },
  async (malvin, mek, m) => {
    const start = Date.now();

    // Optional loading message
    await malvin.sendMessage(
      mek.key.remoteJid,
      { text: "⏳ Pinging SUHO MD V2..." },
      { quoted: fakevCard }
    );

    const ping = Date.now() - start;

    // Smaller, simpler ping message with bot image
    const msg = `
\`╔════════════╗\`
\`║ ⚡ SUHO MD V2 ⚡ ║\`
\`╚════════════╝\`

📡 \`Ping   :\` ${ping} ms  
🟢 \`Status :\` Stable
`;

    await malvin.sendMessage(
      mek.key.remoteJid,
      {
        image: { url: "https://files.catbox.moe/nho7jk.jpg" }, // Your bot image
        caption: msg,
      },
      { quoted: fakevCard }
    );
  }
);