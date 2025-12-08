const { cmd } = require("../command");

cmd(
  {
    pattern: "mods",
    desc: "Show all bot moderators",
    category: "owner",
    filename: __filename,
  },
  async (conn, m) => {
    try {
      const botImageUrl = "https://files.catbox.moe/s11vjp.png"; // Bot image

      const text = `👑 *NovaCore Moderators* 👑

1. ★•Chef_ᴋɪᴡɪ•★ (+27 82 297 2411)
2. IᄃΣY (+27 68 267 9605)

⚡ Moderators help keep NovaCore running smoothly!`;

      await conn.sendMessage(
        m.chat,
        {
          image: { url: botImageUrl },
          caption: text,
        },
        { quoted: m }
      );
    } catch (e) {
      console.error(e);
      await conn.sendMessage(
        m.chat,
        { text: "❌ Could not load mods list." },
        { quoted: m }
      );
    }
  }
);
