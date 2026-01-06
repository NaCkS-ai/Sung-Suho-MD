// plugins/menu.js
const { cmd } = require("../command");

cmd(
  {
    pattern: "menu",
    alias: ["help", "commands"],
    desc: "Show all bot commands",
    category: "info",
    react: "⚡",
    filename: __filename
  },
  async (client, mek, m, { prefix }) => {

    const commands = global.commands || [];
    const grouped = {};

    // Group commands by category
    for (const c of commands) {
      const cat = c.category || "other";
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(c.pattern);
    }

    let menu = `
╔══════════════════════════════╗
║      ⚡ 𝑺𝑼𝑯𝑶 – 𝑴𝑫 𝑽2 ⚡
║   Created By 𝐋𝐎𝐑𝐃 𝐒𝐔𝐍𝐆
╚══════════════════════════════╝

👤 User: @${m.sender.split("@")[0]}
📦 Total Commands: ${commands.length}

`;

    for (const cat in grouped) {
      menu += `
╔═══ 📂 ${cat.toUpperCase()} ═══╗
${grouped[cat]
  .map(cmd => `┃ ➤ ${prefix}${cmd}`)
  .join("\n")}
╚══════════════════════╝
`;
    }

    menu += `
🔥 SUHO-MD V2
⚡ Power • Speed • Stability
`;

    await client.sendMessage(
      mek.key.remoteJid,
      {
        text: menu,
        mentions: [m.sender]
      },
      { quoted: mek }
    );
  }
);
