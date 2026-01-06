const { cmd, commands } = require("../command");
const config = require("../config");
const os = require("os");
const moment = require("moment");

cmd(
  {
    pattern: "menu",
    alias: ["suhomenu", "help"],
    react: "🔥",
    desc: "SUHO-MD V2 main command menu",
    category: "main",
    filename: __filename
  },
  async (conn, mek, m, { from, pushname, sender }) => {
    try {
      const user = pushname || sender.split("@")[0];
      const uptime = moment.duration(process.uptime() * 1000).humanize();
      const usedRam = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(1);
      const totalRam = (os.totalmem() / 1024 / 1024 / 1024).toFixed(1);

      /* GROUP COMMANDS */
      const grouped = {};
      for (const c of commands) {
        if (!c.pattern || c.dontAddCommandList) continue;
        const cat = c.category || "other";
        if (!grouped[cat]) grouped[cat] = [];
        grouped[cat].push(c.pattern);
      }

      /* MENU HEADER */
      let text = `
╔══════════════════════════════╗
║     ⚡ SUHO-MD V2 ⚡
║  『 𝗗𝗢𝗠𝗜𝗡𝗔𝗧𝗜𝗢𝗡 』
╚══════════════════════════════╝

👤 USER      : ${user}
👑 OWNER    : 𝙇𝙊𝙍𝘿 𝙎𝙐𝙉𝙂
🕒 UPTIME   : ${uptime}
💾 RAM      : ${usedRam}MB / ${totalRam}GB
🧠 PREFIX   : ${config.PREFIX}

⚠️ THIS BOT IS NOT NORMAL
⚠️ USE COMMANDS AT YOUR OWN RISK

═══════════ COMMAND CORE ═══════════
`;

      /* CATEGORY ICONS */
      const icons = {
        main: "⚙️",
        owner: "👑",
        group: "👥",
        download: "⬇️",
        fun: "🎭",
        anime: "🌸",
        ai: "🤖",
        convert: "🎨",
        economy: "💰",
        reaction: "💥",
        nsfw: "🔞",
        other: "🧩"
      };

      /* COMMAND LIST */
      for (const [cat, cmds] of Object.entries(grouped)) {
        const icon = icons[cat] || "✦";
        text += `
${icon} 《 ${cat.toUpperCase()} 》
${cmds.map(c => `▸ ${config.PREFIX}${c}`).join("\n")}
`;
      }

      /* FOOTER */
      text += `
══════════════════════════════
⚡ POWERED BY SUHO-MD V2
⚔️ BUILT BY LORD SUNG
🩸 NO LIMITS. NO MERCY.
══════════════════════════════
`;

      await conn.sendMessage(
        from,
        {
          image: { url: "https://files.catbox.moe/nho7jk.jpg" },
          caption: text
        },
        { quoted: mek }
      );

    } catch (err) {
      console.error("SUHO MENU ERROR:", err);
    }
  }
);
