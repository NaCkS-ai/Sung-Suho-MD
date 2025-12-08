const { cmd } = require("../command");
const moment = require("moment");

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
    pattern: "uptime",
    alias: ["up"],
    react: "⏳",
    desc: "Check bot uptime",
    category: "main",
    filename: __filename,
  },
  async (malvin, mek, m, { reply, from }) => {
    try {
      const duration = moment.duration(process.uptime(), "seconds");
      const uptime = `${duration.hours()}h ${duration.minutes()}m ${duration.seconds()}s`;

      const caption = `
╭───❮ ⏳ 𝗕𝗢𝗧 𝗨𝗣𝗧𝗜𝗠𝗘 ❯───
│ 🤖 *Bot:* SUHO MD V2
│ ⏱️ *Uptime:* ${uptime}
│ 📅 *Date:* ${moment().format("DD/MM/YYYY")}
│ 🕒 *Time:* ${moment().format("HH:mm:ss")}
╰─────────────────────────

> 🚀 Powered by *SUHO MD V2*
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
      console.error("Uptime Command Error:", e);
      reply("❌ Failed to fetch uptime.", fakevCard);
    }
  }
);