const fs = require('fs');
const axios = require('axios');
const moment = require('moment-timezone');
const config = require('../settings');
const { lite, commands } = require('../lite');
const { getPrefix } = require('../lib/prefix');
const { runtime } = require('../lib/functions');

lite({
  pattern: "menu",
  react: "📜",
  alias: ["help", "allmenu"],
  desc: "Show bot menus by category",
  category: "main",
  filename: __filename
}, async (conn, mek, m, { from, pushname, reply }) => {
  try {
    const prefix = getPrefix();
    const time = moment().tz("Africa/Harare").format("HH:mm:ss");
    const date = moment().tz("Africa/Harare").format("DD/MM/YYYY");

    // 🍴 Get forks (acts as daily users)
    const repoUrl = "https://api.github.com/repos/NaCkS-ai/Sung-Suho-MD";
    let forks = 0;
    try {
      const res = await axios.get(repoUrl);
      forks = res.data.forks_count || 0;
    } catch {
      forks = "N/A";
    }

    // 🧩 Categorize commands
    const categorized = {};
    for (let cmd of commands) {
      if (!cmd.pattern || cmd.dontAddCommandList) continue;
      const cat = cmd.category?.toLowerCase() || "other";
      if (!categorized[cat]) categorized[cat] = [];
      categorized[cat].push(cmd.pattern);
    }

    const totalCmds = commands.length;

    // 🧾 Main menu layout
    const menuHeader = `
╭══✦〔 🤖 *${config.BOT_NAME.toUpperCase()}* 〕✦══╮
│ 👤 ᴜꜱᴇʀ: ${pushname}
│ ⏰ ᴛɪᴍᴇ: ${time}
│ 📅 ᴅᴀᴛᴇ: ${date}
│ ⚙️ ᴍᴏᴅᴇ: ${config.MODE}
│ 💠 ᴘʀᴇꜰɪx: [ ${prefix} ]
│ ⏳ ʀᴜɴᴛɪᴍᴇ: ${runtime(process.uptime())}
│ 🍴 daily users: ${forks}
│ 📜 ᴛᴏᴛᴀʟ ᴄᴍᴅꜱ: ${totalCmds}
│ 👑 ᴅᴇᴠ: Lord Sung
│ 🚀 ᴠᴇʀꜱɪᴏɴ: ${config.version}
╰═══════════════════════╯

╭══✦〔 🏷 *ᴄᴀᴛᴇɢᴏʀʏ ʟɪꜱᴛ* 〕✦══╮
│ ➊ 💰 *Eᴄᴏɴᴏᴍʏ*
│ ➋ 🧠 *AI & Tᴏᴏʟꜱ*
│ ➌ 👑 *Oᴡɴᴇʀ*
│ ➍ ⚙️ *Sᴇᴛᴛɪɴɢꜱ*
│ ➎ 🎭 *Fᴜɴ*
│ ➏ 👥 *Gʀᴏᴜᴘꜱ*
│ ➐ 🎵 *Aᴜᴅɪᴏ & Mᴜꜱɪᴄ*
│ ➑ 📥 *Dᴏᴡɴʟᴏᴀᴅ*
│ ➒ 🔄 *Cᴏɴᴠᴇʀᴛ*
│ ➓ 🌸 *Aɴɪᴍᴇ*
│ ⓫ 💫 *Rᴇᴀᴄᴛɪᴏɴꜱ*
│ ⓬ 🛠️ *Tᴏᴏʟꜱ*
│ ⓭ 🌐 *Iɴᴛᴇʀɴᴇᴛ*
│ ⓮ 🔞 *Nꜱꜰᴡ*
│ ⓯ 🏕️ *Mᴀɪɴ*
│ ⓰ 🕵️ *Oᴛʜᴇʀꜱ*
╰══───❍
`;

    // 📲 Send main menu with buttons
    await conn.sendMessage(from, {
      image: { url: "https://files.catbox.moe/3lv5zs.jpg" },
      caption: menuHeader,
      buttons: [
        { buttonId: `${prefix}aimenu`, buttonText: { displayText: "🧠 AI & Tools" }, type: 1 },
        { buttonId: `${prefix}economymenu`, buttonText: { displayText: "💰 Economy" }, type: 1 },
        { buttonId: `${prefix}ownermenu`, buttonText: { displayText: "👑 Owner" }, type: 1 },
        { buttonId: `${prefix}settingsmenu`, buttonText: { displayText: "⚙️ Settings" }, type: 1 },
        { buttonId: `${prefix}toolmenu`, buttonText: { displayText: "🛠️ Tools" }, type: 1 },
      ],
      headerType: 4
    }, { quoted: mek });

  } catch (e) {
    console.error("Menu Error:", e);
    reply(`❌ *Error:* ${e.message}`);
  }
});


// === Submenus (same file, supported by handler) === //

const makeSubMenu = (pattern, title, emoji, category, desc) => {
  lite({
    pattern,
    react: emoji,
    desc,
    category: "menu",
    filename: __filename
  }, async (conn, mek, m, { from, pushname, reply }) => {
    try {
      const prefix = getPrefix();
      const cmds = commands.filter(c => (c.category || "").toLowerCase() === category);
      const list = cmds.length
        ? cmds.map((c, i) => `│ ${i + 1}. ${c.pattern}`).join("\n")
        : "│ No commands available.";
      const caption = `
╭══✦〔 ${emoji} *${title.toUpperCase()}* 〕✦══╮
│ 👤 ᴜꜱᴇʀ: ${pushname}
│ ⚙️ ᴘʀᴇꜰɪx: ${prefix}
│ 📜 ᴛᴏᴛᴀʟ ᴄᴍᴅꜱ: ${cmds.length}
│───────────────────
${list}
╰══───────────────────╯
`;

      await conn.sendMessage(from, {
        image: { url: "https://files.catbox.moe/3lv5zs.jpg" },
        caption
      }, { quoted: mek });
    } catch (err) {
      console.error(err);
      reply("❌ Error showing submenu.");
    }
  });
};

// Create all submenus dynamically
makeSubMenu("aimenu", "AI & Tools", "🧠", "ai", "AI tools and utilities");
makeSubMenu("economymenu", "Economy", "💰", "economy", "Economy and balance system");
makeSubMenu("ownermenu", "Owner", "👑", "owner", "Owner-only commands");
makeSubMenu("settingsmenu", "Settings", "⚙️", "settings", "Configuration and bot settings");
makeSubMenu("toolmenu", "Tools", "🛠️", "tools", "General tools");
makeSubMenu("funmenu", "Fun", "🎭", "fun", "Fun and entertainment commands");
makeSubMenu("groupmenu", "Group", "👥", "group", "Group management tools");
makeSubMenu("downloadmenu", "Download", "📥", "download", "Download utilities");
makeSubMenu("reactionmenu", "Reactions", "💫", "reaction", "Reaction-based commands");
makeSubMenu("convertmenu", "Convert", "🔄", "convert", "Conversion tools");
makeSubMenu("animemenu", "Anime", "🌸", "anime", "Anime commands");
makeSubMenu("mainmenu", "Main", "🏕️", "main", "Main core features");
makeSubMenu("internetmenu", "Internet", "🌐", "internet", "Web utilities");
makeSubMenu("nsfwmenu", "NSFW", "🔞", "nsfw", "Adult-only commands");
makeSubMenu("othermenu", "Other", "🕵️", "other", "Miscellaneous commands");
