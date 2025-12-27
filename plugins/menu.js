// plugins/menu.js
const { cmd, commands } = require("../command");
const config = require("../config");

cmd(
  {
    pattern: "menu",
    alias: ["help", "commands"],
    react: "📜",
    desc: "Show all bot commands by category",
    category: "main",
    filename: __filename,
  },
  async (malvin, mek, m, { from, pushname, sender }) => {
    try {
      const user = pushname || sender.split("@")[0];

      // Group commands by category
      const categorized = {};
      for (const c of commands) {
        if (!c.pattern || c.dontAddCommandList) continue;
        const cat = c.category || "other";
        if (!categorized[cat]) categorized[cat] = [];
        categorized[cat].push(c.pattern);
      }

      // Header
      let menuText = `
╭━━━〔 🤖 SUHO-MD V2 〕━━━╮
┃ 👤 User   : ${user}
┃ 👑 Owner  : 𝙇𝙊𝙍𝘿 𝙎𝙐𝙉𝙂
┃ ⚙ Prefix : ${config.PREFIX}
┃ 📦 Mode   : ${config.MODE}
╰━━━━━━━━━━━━━━━━━━━━╯
`;

      // Category Emojis
      const emojis = {
        main: "⚙️",
        download: "📥",
        group: "👥",
        fun: "🎉",
        owner: "👑",
        ai: "🤖",
        anime: "🌸",
        convert: "🎨",
        reaction: "💫",
        economy: "💰",
        search: "🔎",
        utility: "🛠️",
        other: "🧩",
      };

      // Build menu
      for (const [cat, list] of Object.entries(categorized)) {
        const emoji = emojis[cat] || "✦";
        const title = cat.toUpperCase();

        menuText += `
╭─ ${emoji} *${title}*
`;

        list.forEach(cmdName => {
          menuText += `│ ▸ ${config.PREFIX}${cmdName}\n`;
        });

        menuText += `╰───────────────\n`;
      }

      menuText += `
⚡ Powered by *SUHO-MD V2*
`;

      // Send menu with image
      await malvin.sendMessage(
        from,
        {
          image: { url: "https://files.catbox.moe/nho7jk.jpg" },
          caption: menuText.trim(),
        },
        { quoted: mek }
      );

    } catch (e) {
      console.error("Menu Error:", e);
      await malvin.sendMessage(from, { text: "❌ Failed to load menu." }, { quoted: mek });
    }
  }
);
