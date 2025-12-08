const { cmd } = require("../command");
const config = require("../config");

// Fake ChatGPT vCard
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
    pattern: "system",
    alias: ["sys", "botstatus"],
    react: "🖥️",
    desc: "Check if the bot is in public or private mode.",
    category: "main",
    filename: __filename,
  },
  async (malvin, mek, m, { reply }) => {
    try {
      const mode = (config.MODE || "").toLowerCase();
      let status;

      if (mode === "public") {
        status = "🌍 Bot is running in *Public Mode*";
      } else if (mode === "private") {
        status = "🔒 Bot is running in *Private Mode*";
      } else {
        status = `⚠️ Unknown Mode: *${config.MODE || "Not Set"}*`;
      }

      const msg = `
┏━━━━━━━━━━━━━━━━━━━━━━┓
┃ 🖥️ 𝑵𝑶𝑽𝑨𝑪𝑶𝑹𝑬✟ SYSTEM STATUS
┗━━━━━━━━━━━━━━━━━━━━━━┛

${status}

━━━━━━━━━━━━━━━━━━━━━━━
✅ Bot running smoothly
━━━━━━━━━━━━━━━━━━━━━━━
`;

      await malvin.sendMessage(
        mek.key.remoteJid,
        { text: msg },
        { quoted: fakevCard }
      );
    } catch (e) {
      console.error("System Command Error:", e);
      await reply("❌ Error while checking bot status.");
    }
  }
);