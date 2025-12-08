// plugins/allmenu.js
const { cmd, commands } = require("../command");
const config = require("../config");
const os = require("os");
const moment = require("moment");

cmd(
  {
    pattern: "allmenu",
    alias: ["menu2"],
    react: "📖",
    desc: "Show all bot commands with a clean list",
    category: "main",
    filename: __filename,
  },
  async (malvin, mek, m, { from, pushname, sender, reply }) => {
    try {
      const uptime = moment.duration(process.uptime() * 1000).humanize();
      const totalRam = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2) + " GB";
      const usedRam = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2) + " MB";
      const owner = config.OWNER_NUMBER || "Unknown";
      const user = pushname || sender.split("@")[0];

      // Group commands by category dynamically
      const categorized = {};
      commands.forEach((cmdItem) => {
        if (!cmdItem.pattern || cmdItem.dontAddCommandList) return;
        const cat = cmdItem.category || "other";
        if (!categorized[cat]) categorized[cat] = [];
        categorized[cat].push(cmdItem.pattern);
      });

      // Menu text
      let menuText = `💠 SUHO-MD V2✟ ALL MENU 💠

👤 User    : ${user}
👑 Owner   : ${owner}
🕒 Uptime  : ${uptime}
💾 Memory  : ${usedRam} / ${totalRam}
🛎️ Prefix  : ${config.PREFIX}

━━━━━━━━━━━━━━━━━━━━━━
`;

      // Optional emojis for categories
      const categoryEmojis = {
        main: "⚙️",
        download: "📥",
        group: "👥",
        owner: "👑",
        convert: "🎨",
        fun: "🎉",
        reaction: "💫",
        anime: "🌸",
        search: "🔍",
        utility: "🛠️",
        economy: "💰",
        nsfw: "🔞",
        ai: "🤖",
        other: "🧩",
      };

      // List all categories and commands
      for (const [cat, cmds] of Object.entries(categorized)) {
        const emoji = categoryEmojis[cat] || "✦";
        const title = cat.charAt(0).toUpperCase() + cat.slice(1);
        menuText += `${emoji} *${title} Commands*\n`;
        cmds.forEach((cmdName, i) => {
          menuText += `  └ ${i + 1}. ${config.PREFIX}${cmdName}\n`;
        });
        menuText += "━━━━━━━━━━━━━━━━━━━━━━\n";
      }

      menuText += `⚡ Powered by lord sung✟ ⚡`;

      // Send menu as a single image + caption
      await malvin.sendMessage(
        from,
        {
          image: { url: "https://files.catbox.moe/3lv5zs.jpg" },
          caption: menuText,
        },
        { quoted: mek }
      );
    } catch (e) {
      console.error("❌ allmenu error:", e);
      await reply("❌ Error loading all menu.");
    }
  }
);
