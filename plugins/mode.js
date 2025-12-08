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
    pattern: "mode",
    alias: ["setmode"],
    react: "🔄",
    desc: "Switch bot mode between Public and Private",
    category: "config",
    filename: __filename,
  },
  async (malvin, mek, m, { reply, args, isOwner }) => {
    try {
      if (!isOwner) return reply("❌ Only the *Bot Owner* can change the mode.", fakevCard);

      const mode = (args[0] || "").toLowerCase();
      if (!["public", "private"].includes(mode)) {
        return reply("⚠️ Invalid mode!\n\nUsage:\n*.mode public*\n*.mode private*", fakevCard);
      }

      config.MODE = mode; // Updates bot mode dynamically

      if (mode === "public") {
        reply("🌍 The bot is now running in *Public Mode*.\nAnyone can use commands.", fakevCard);
      } else {
        reply("🔒 The bot is now running in *Private Mode*.\nOnly the owner can use commands.", fakevCard);
      }
    } catch (e) {
      console.error("Mode Command Error:", e);
      reply("❌ Failed to change bot mode.", fakevCard);
    }
  }
);