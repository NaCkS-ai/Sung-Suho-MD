// plugins/fun.js
const { cmd } = require("../command");
const config = require("../config");

// ---------------- COMPATIBILITY ----------------
cmd({
  pattern: "compatibility",
  alias: ["friend", "fcheck"],
  desc: "Calculate compatibility score between two users.",
  category: "fun",
  react: "💖",
  filename: __filename,
  use: "@tag1 @tag2",
}, async (conn, mek, m, { reply }) => {
  try {
    if (!m.mentionedJid || m.mentionedJid.length < 2) {
      return reply("❌ Please tag two users.\nExample: .compatibility @user1 @user2");
    }

    let [user1, user2] = m.mentionedJid;
    const specialNumber = config.DEV ? `${config.DEV}@s.whatsapp.net` : null;

    let compatibilityScore = Math.floor(Math.random() * 1000) + 1;
    if (user1 === specialNumber || user2 === specialNumber) {
      compatibilityScore = 1000;
    }

    await conn.sendMessage(mek.chat, {
      text: `💖 Compatibility between @${user1.split('@')[0]} and @${user2.split('@')[0]}: *${compatibilityScore}/1000* 💖`,
      mentions: [user1, user2],
    }, { quoted: mek });

  } catch (e) {
    console.error(e);
    reply("⚠️ Error in compatibility command.");
  }
});

// ---------------- AURA ----------------
cmd({
  pattern: "aura",
  desc: "Calculate aura score of a user.",
  category: "fun",
  react: "💀",
  filename: __filename,
  use: "@tag",
}, async (conn, mek, m, { reply }) => {
  try {
    if (!m.mentionedJid || m.mentionedJid.length < 1) {
      return reply("❌ Please tag a user.\nExample: .aura @user");
    }

    let user = m.mentionedJid[0];
    const specialNumber = config.DEV ? `${config.DEV}@s.whatsapp.net` : null;

    let auraScore = Math.floor(Math.random() * 1000) + 1;
    if (user === specialNumber) auraScore = 999999;

    await conn.sendMessage(mek.chat, {
      text: `💀 Aura of @${user.split('@')[0]}: *${auraScore}/1000* 🗿`,
      mentions: [user],
    }, { quoted: mek });

  } catch (e) {
    console.error(e);
    reply("⚠️ Error in aura command.");
  }
});

// ---------------- ROAST ----------------
cmd({
  pattern: "roast",
  desc: "Roast someone",
  category: "fun",
  react: "🔥",
  filename: __filename,
  use: "@tag",
}, async (conn, mek, m, { reply }) => {
  let roasts = [
    "Bro, your IQ is lower than a weak WiFi signal!",
    "You're a VIP — Very Idiotic Person!",
    "Your brain is like a broken link — never connects!",
    "You're a living example of ‘404 Not Found’!",
    "Your life has an unknown error — no solution found!"
  ];

  let randomRoast = roasts[Math.floor(Math.random() * roasts.length)];
  let mentionedUser = m.mentionedJid[0] || (mek.quoted && mek.quoted.sender);

  if (!mentionedUser) return reply("❌ Tag someone to roast!\nExample: .roast @user");

  let target = `@${mentionedUser.split("@")[0]}`;
  let message = `${target}: *${randomRoast}*\n🔥 Just for fun, don’t take it seriously!`;

  await conn.sendMessage(mek.chat, { text: message, mentions: [mentionedUser] }, { quoted: mek });
});

// ---------------- 8BALL ----------------
cmd({
  pattern: "8ball",
  desc: "Magic 8-Ball answers your question",
  category: "fun",
  react: "🎱",
  filename: __filename,
}, async (conn, mek, m, { q, reply }) => {
  if (!q) return reply("❌ Ask a yes/no question!\nExample: .8ball Will I be rich?");

  let responses = ["Yes!", "No.", "Maybe...", "Definitely!", "Not sure.", "Ask again later."];
  let answer = responses[Math.floor(Math.random() * responses.length)];

  reply(`🎱 *Magic 8-Ball says:* ${answer}`);
});

// ---------------- COMPLIMENT ----------------
cmd({
  pattern: "compliment",
  desc: "Give a nice compliment",
  category: "fun",
  react: "😊",
  filename: __filename,
}, async (conn, mek, m, { reply }) => {
  let compliments = [
    "You're amazing just the way you are! 💖",
    "Your smile is contagious! 😊",
    "You're a genius in your own way! 🧠",
    "You're unique and irreplaceable! ✨",
    "You're stronger than you think! 💪"
  ];

  let randomCompliment = compliments[Math.floor(Math.random() * compliments.length)];
  let mentionedUser = m.mentionedJid[0] || (mek.quoted && mek.quoted.sender);

  let target = mentionedUser ? `@${mentionedUser.split("@")[0]}` : "you";

  await conn.sendMessage(mek.chat, {
    text: `😊 Compliment for ${target}: *${randomCompliment}*`,
    mentions: mentionedUser ? [mentionedUser] : [],
  }, { quoted: mek });
});

// ---------------- LOVE TEST ----------------
cmd({
  pattern: "lovetest",
  desc: "Check love compatibility between two users",
  category: "fun",
  react: "❤️",
  filename: __filename,
  use: "@tag1 @tag2",
}, async (conn, mek, m, { reply }) => {
  if (!m.mentionedJid || m.mentionedJid.length < 2) {
    return reply("❌ Tag two users!\nExample: .lovetest @user1 @user2");
  }

  let [user1, user2] = m.mentionedJid;
  let lovePercent = Math.floor(Math.random() * 100) + 1;

  let message = `💘 *Love Test* 💘\n❤️ @${user1.split('@')[0]} + @${user2.split('@')[0]} = *${lovePercent}%*`;

  await conn.sendMessage(mek.chat, { text: message, mentions: [user1, user2] }, { quoted: mek });
});

// ---------------- EMOJI ----------------
cmd({
  pattern: "emoji",
  desc: "Convert text into emojis",
  category: "fun",
  react: "🙂",
  filename: __filename,
}, async (conn, mek, m, { args, reply }) => {
  let text = args.join(" ");
  if (!text) return reply("❌ Provide text to convert into emojis!\nExample: .emoji hello");

  let emojiMapping = {
    "a": "🅰️", "b": "🅱️", "c": "🇨️", "d": "🇩️", "e": "🇪️", "f": "🇫️",
    "g": "🇬️", "h": "🇭️", "i": "🇮️", "j": "🇯️", "k": "🇰️", "l": "🇱️",
    "m": "🇲️", "n": "🇳️", "o": "🅾️", "p": "🇵️", "q": "🇶️", "r": "🇷️",
    "s": "🇸️", "t": "🇹️", "u": "🇺️", "v": "🇻️", "w": "🇼️", "x": "🇽️",
    "y": "🇾️", "z": "🇿️",
    "0": "0️⃣", "1": "1️⃣", "2": "2️⃣", "3": "3️⃣", "4": "4️⃣",
    "5": "5️⃣", "6": "6️⃣", "7": "7️⃣", "8": "8️⃣", "9": "9️⃣"
  };

  let emojiText = text.toLowerCase().split("").map(c => emojiMapping[c] || c).join("");
  await conn.sendMessage(mek.chat, { text: emojiText }, { quoted: mek });
});
