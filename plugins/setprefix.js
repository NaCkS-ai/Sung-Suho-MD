const { cmd } = require("../command");
const config = require("../config");

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
    pattern: "setprefix",
    desc: "Change the bot's command prefix",
    react: "⚙️",
    category: "config",
    filename: __filename,
  },
  async (malvin, mek, m, { reply, args, isOwner }) => {
    try {
      if (!isOwner) return reply("❌ Only the *Bot Owner* can change the prefix.", fakevCard);

      const newPrefix = args[0];
      if (!newPrefix) return reply("⚠️ Please provide a new prefix.\n\nExample: *.setprefix !*", fakevCard);

      config.PREFIX = newPrefix; // Dynamically updates prefix
      reply(`✅ Prefix successfully updated to: *${newPrefix}*`, fakevCard);
    } catch (e) {
      console.error("SetPrefix Command Error:", e);
      reply("❌ Failed to change prefix.", fakevCard);
    }
  }
);