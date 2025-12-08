const { cmd } = require("../command");

// Fake vCard
const fakevCard = {
  key: {
    fromMe: false,
    participant: "0@s.whatsapp.net",
    remoteJid: "status@broadcast",
  },
  message: {
    contactMessage: {
      displayName: "© 𝑵𝑶𝑽𝑨𝑪𝑶𝑹𝑬✟",
      vcard: `BEGIN:VCARD
VERSION:3.0
FN:Meta
ORG:META AI;
TEL;type=CELL;type=VOICE;waid=13135550002:+13135550002
END:VCARD`,
    },
  },
};

cmd(
  {
    pattern: "helpers",
    alias: ["credits", "team"],
    react: "🤝",
    desc: "Show the helpers who contributed to this bot",
    category: "info",
    filename: __filename,
  },
  async (malvin, mek, m, { reply, from }) => {
    try {
      const caption = `
╭───❮ 𝗕𝗢𝗧 𝗛𝗘𝗟𝗣𝗘𝗥𝗦 ❯───
│ 🤝 *Meet the amazing people who made this bot possible!*
│
│ 👑 *Dev Sung*
│ ⚡ *Kelvin Tech*
│ 💻 *Malvin King*
╰───────────────────────

> 🚀 Powered by *𝑵𝑶𝑽𝑨𝑪𝑶𝑹𝑬✟*
      `.trim();

      await malvin.sendMessage(
        from,
        {
          image: { url: "https://i.ibb.co/SDWZFh23/malvin-xd.jpg" }, // replace with a team banner if you have one
          caption,
        },
        { quoted: fakevCard }
      );
    } catch (e) {
      console.error("Helpers Command Error:", e);
      reply("❌ Failed to load helpers list.", fakevCard);
    }
  }
);