const fs = require('fs');
const axios = require('axios');
const moment = require('moment-timezone');
const config = require('../settings');
const { lite } = require('../lite');
const { getPrefix } = require('../lib/prefix');
const { runtime } = require('../lib/functions');

const MENU_IMAGE = "https://files.catbox.moe/66u4mj.png";
const BOT_NAME = "*『 SUHO MD 』*";

// ╔═══════════════════════════════════╗
//        MAIN INTERACTIVE MENU
// ╚═══════════════════════════════════╝
lite({
  pattern: "menu",
  react: "📱",
  desc: "Main interactive bot menu",
  category: "main",
  filename: __filename
}, async (conn, mek, m, { from, pushname }) => {
  try {
    const prefix = getPrefix();
    const time = moment().tz("Africa/Harare").format("HH:mm:ss");
    const date = moment().tz("Africa/Harare").format("DD/MM/YYYY");

    const repoUrl = "https://api.github.com/repos/NaCkS-ai/Sung-Suho-MD";
    let forks = 0;
    try {
      const res = await axios.get(repoUrl);
      forks = res.data.forks_count || 0;
    } catch {
      forks = "N/A";
    }

    const caption = `
╭───❍ ${BOT_NAME} ❍───╮
│ 👤 *User:* ${pushname}
│ 🕒 *Time:* ${time}
│ 📅 *Date:* ${date}
│ ⚙️ *Mode:* ${config.MODE}
│ 💠 *Prefix:* ${prefix}
│ ⏳ *Uptime:* ${runtime(process.uptime())}
│ 🍴 *Daily Users:* ${forks}
│ 👑 *Dev:* Lord Sung
│ 🚀 *Version:* ${config.version}
╰───────────────────╯

╭══✦〔 🏷 *CATEGORY LIST* 〕✦══╮
│ ➊ 🤖 AI & Tools
│ ➋ 👑 Owner Menu
│ ➌ ⚙️ Settings
│ ➍ 🌐 Environment
│ ➎ 💰 Economy
│ ➏ 🕹️ Fun & Games
│ ➐ 👥 Group Menu
│ ➑ 🎨 Logo & Edit
│ ➒ 🎵 Music Menu
│ ➓ 🛠️ Utilities
│ ⓫ 💫 Reactions
│ ⓬ 🏕️ Main Menu
╰══───────────────══╯

_Select a category below 👇_
`;

    const buttons = [
      { buttonId: `${prefix}aimenu`, buttonText: { displayText: "🤖 AI MENU" }, type: 1 },
      { buttonId: `${prefix}ownermenu`, buttonText: { displayText: "👑 OWNER MENU" }, type: 1 },
      { buttonId: `${prefix}settingsmenu`, buttonText: { displayText: "⚙️ SETTINGS" }, type: 1 },
      { buttonId: `${prefix}envmenu`, buttonText: { displayText: "🌐 ENVIRONMENT" }, type: 1 },
      { buttonId: `${prefix}economymenu`, buttonText: { displayText: "💰 ECONOMY" }, type: 1 },
      { buttonId: `${prefix}funmenu`, buttonText: { displayText: "🕹️ FUN & GAMES" }, type: 1 },
      { buttonId: `${prefix}groupmenu`, buttonText: { displayText: "👥 GROUP MENU" }, type: 1 },
      { buttonId: `${prefix}logomenu`, buttonText: { displayText: "🎨 LOGO MENU" }, type: 1 },
      { buttonId: `${prefix}musicmenu`, buttonText: { displayText: "🎵 MUSIC" }, type: 1 },
      { buttonId: `${prefix}utilitiesmenu`, buttonText: { displayText: "🛠️ UTILITIES" }, type: 1 },
      { buttonId: `${prefix}reactionmenu`, buttonText: { displayText: "💫 REACTIONS" }, type: 1 },
      { buttonId: `${prefix}mainmenu`, buttonText: { displayText: "🏕️ MAIN MENU" }, type: 1 }
    ];

    await conn.sendMessage(from, {
      image: { url: MENU_IMAGE },
      caption,
      footer: "SUHO MD – The Next Gen WhatsApp Bot 🤖",
      buttons,
      headerType: 4
    }, { quoted: mek });

  } catch (err) {
    console.error("Menu Error:", err);
    conn.sendMessage(from, { text: `❌ *Error:* ${err.message}` }, { quoted: mek });
  }
});


// ╔═══════════════════════════════════╗
//        SUB-MENUS SECTION
// ╚═══════════════════════════════════╝

// AI MENU
lite({
  pattern: "aimenu",
  react: "🤖",
  category: "submenu",
  filename: __filename
}, async (conn, mek, m, { from }) => {
  const caption = `
${BOT_NAME}
╭───❍ 🤖 *AI & Tools Menu* ❍───╮
│ 💬 ${config.PREFIX}ai <query>
│ 🖼️ ${config.PREFIX}img <prompt>
│ 🧠 ${config.PREFIX}gpt <text>
│ 🌍 ${config.PREFIX}translate <lang> <text>
│ 📜 ${config.PREFIX}define <word>
╰──────────────────╯
`;
  await conn.sendMessage(from, { image: { url: MENU_IMAGE }, caption }, { quoted: mek });
});

// OWNER MENU
lite({
  pattern: "ownermenu",
  react: "👑",
  category: "submenu",
  filename: __filename
}, async (conn, mek, m, { from }) => {
  const caption = `
${BOT_NAME}
╭───❍ 👑 *Owner Menu* ❍───╮
│ 🧩 ${config.PREFIX}eval <code>
│ 🔁 ${config.PREFIX}restart
│ 💾 ${config.PREFIX}backup
│ 📤 ${config.PREFIX}update
│ 🚫 ${config.PREFIX}ban <user>
╰──────────────────╯
`;
  await conn.sendMessage(from, { image: { url: MENU_IMAGE }, caption }, { quoted: mek });
});

// ECONOMY MENU
lite({
  pattern: "economymenu",
  react: "💰",
  category: "submenu",
  filename: __filename
}, async (conn, mek, m, { from }) => {
  const caption = `
${BOT_NAME}
╭───❍ 💰 *Economy Menu* ❍───╮
│ 💵 ${config.PREFIX}balance
│ 🏦 ${config.PREFIX}deposit <amount>
│ 💸 ${config.PREFIX}withdraw <amount>
│ 🎰 ${config.PREFIX}gamble <amount>
│ 🎯 ${config.PREFIX}work
│ 🏆 ${config.PREFIX}leaderboard
╰──────────────────╯
`;
  await conn.sendMessage(from, { image: { url: MENU_IMAGE }, caption }, { quoted: mek });
});

// SETTINGS MENU
lite({
  pattern: "settingsmenu",
  react: "⚙️",
  category: "submenu",
  filename: __filename
}, async (conn, mek, m, { from }) => {
  const caption = `
${BOT_NAME}
╭───❍ ⚙️ *Settings Menu* ❍───╮
│ 🛠️ ${config.PREFIX}setprefix <symbol>
│ 🔇 ${config.PREFIX}mute
│ 🔊 ${config.PREFIX}unmute
│ 🔁 ${config.PREFIX}autoreply <on/off>
│ 🔐 ${config.PREFIX}antidelete <on/off>
╰──────────────────╯
`;
  await conn.sendMessage(from, { image: { url: MENU_IMAGE }, caption }, { quoted: mek });
});

// ENVIRONMENT MENU
lite({
  pattern: "envmenu",
  react: "🌐",
  category: "submenu",
  filename: __filename
}, async (conn, mek, m, { from }) => {
  const caption = `
${BOT_NAME}
╭───❍ 🌐 *Environment Info* ❍───╮
│ 🌍 Mode: ${config.MODE}
│ 💠 Prefix: ${config.PREFIX}
│ 📦 Version: ${config.version}
│ ⚙️ Uptime: ${runtime(process.uptime())}
│ 📁 Database: ./database/
╰──────────────────╯
`;
  await conn.sendMessage(from, { image: { url: MENU_IMAGE }, caption }, { quoted: mek });
});

// FUN & GAMES
lite({
  pattern: "funmenu",
  react: "🕹️",
  category: "submenu",
  filename: __filename
}, async (conn, mek, m, { from }) => {
  const caption = `
${BOT_NAME}
╭───❍ 🕹️ *Fun & Games* ❍───╮
│ 🎮 ${config.PREFIX}tictactoe
│ 🎲 ${config.PREFIX}rps
│ 💬 ${config.PREFIX}truth
│ 😈 ${config.PREFIX}dare
│ 🃏 ${config.PREFIX}slot
╰──────────────────╯
`;
  await conn.sendMessage(from, { image: { url: MENU_IMAGE }, caption }, { quoted: mek });
});

// GROUP MENU
lite({
  pattern: "groupmenu",
  react: "👥",
  category: "submenu",
  filename: __filename
}, async (conn, mek, m, { from }) => {
  const caption = `
${BOT_NAME}
╭───❍ 👥 *Group Menu* ❍───╮
│ 🧾 ${config.PREFIX}promote
│ 🗑️ ${config.PREFIX}kick
│ 📢 ${config.PREFIX}tagall
│ 🕵️ ${config.PREFIX}hidetag
│ 🛡️ ${config.PREFIX}antilink <on/off>
╰──────────────────╯
`;
  await conn.sendMessage(from, { image: { url: MENU_IMAGE }, caption }, { quoted: mek });
});

// LOGO MENU
lite({
  pattern: "logomenu",
  react: "🎨",
  category: "submenu",
  filename: __filename
}, async (conn, mek, m, { from }) => {
  const caption = `
${BOT_NAME}
╭───❍ 🎨 *Logo Menu* ❍───╮
│ 🖋️ ${config.PREFIX}logo <text>
│ 💫 ${config.PREFIX}neon <text>
│ 🔥 ${config.PREFIX}fire <text>
│ 🧊 ${config.PREFIX}ice <text>
│ 🌸 ${config.PREFIX}flower <text>
╰──────────────────╯
`;
  await conn.sendMessage(from, { image: { url: MENU_IMAGE }, caption }, { quoted: mek });
});

// MUSIC MENU
lite({
  pattern: "musicmenu",
  react: "🎵",
  category: "submenu",
  filename: __filename
}, async (conn, mek, m, { from }) => {
  const caption = `
${BOT_NAME}
╭───❍ 🎵 *Music Menu* ❍───╮
│ 🎧 ${config.PREFIX}play <song>
│ 📥 ${config.PREFIX}ytmp3 <url>
│ 🎬 ${config.PREFIX}ytmp4 <url>
│ 📻 ${config.PREFIX}spotify <song>
│ 🕹️ ${config.PREFIX}lyrics <song>
╰──────────────────╯
`;
  await conn.sendMessage(from, { image: { url: MENU_IMAGE }, caption }, { quoted: mek });
});

// UTILITIES MENU
lite({
  pattern: "utilitiesmenu",
  react: "🛠️",
  category: "submenu",
  filename: __filename
}, async (conn, mek, m, { from }) => {
  const caption = `
${BOT_NAME}
╭───❍ 🛠️ *Utilities* ❍───╮
│ 🕒 ${config.PREFIX}ping
│ 📊 ${config.PREFIX}stats
│ 🧩 ${config.PREFIX}system
│ 📅 ${config.PREFIX}date
│ 🧠 ${config.PREFIX}calc <expr>
╰──────────────────╯
`;
  await conn.sendMessage(from, { image: { url: MENU_IMAGE }, caption }, { quoted: mek });
});

// REACTION MENU
lite({
  pattern: "reactionmenu",
  react: "💫",
  category: "submenu",
  filename: __filename
}, async (conn, mek, m, { from }) => {
  const caption = `
${BOT_NAME}
╭───❍ 💫 *Reactions* ❍───╮
│ ❤️ ${config.PREFIX}love
│ 😂 ${config.PREFIX}laugh
│ 😡 ${config.PREFIX}angry
│ 😢 ${config.PREFIX}sad
│ 😎 ${config.PREFIX}cool
╰──────────────────╯
`;
  await conn.sendMessage(from, { image: { url: MENU_IMAGE }, caption }, { quoted: mek });
});

// MAIN MENU
lite({
  pattern: "mainmenu",
  react: "🏕️",
  category: "submenu",
  filename: __filename
}, async (conn, mek, m, { from }) => {
  const caption = `
${BOT_NAME}
╭───❍ 🏕️ *Main Menu* ❍───╮
│ 🧠 ${config.PREFIX}help
│ 📜 ${config.PREFIX}menu
│ 🩶 ${config.PREFIX}about
│ 📊 ${config.PREFIX}stats
│ 🔗 ${config.PREFIX}support
╰──────────────────╯
`;
  await conn.sendMessage(from, { image: { url: MENU_IMAGE }, caption }, { quoted: mek });
});
