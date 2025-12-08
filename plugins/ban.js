// plugins/ban.js
const { cmd } = require("../command");

if (!global.bannedUsers) global.bannedUsers = new Set();

cmd(
  {
    pattern: "ban",
    desc: "Ban a user from using the bot",
    react: "⛔",
    category: "owner",
    filename: __filename,
    fromMe: true, // only bot owner can ban
  },
  async (malvin, mek, m, { args, reply }) => {
    try {
      const userToBan = args[0];
      if (!userToBan) return reply("❌ Usage: .ban <number>");

      global.bannedUsers.add(userToBan);
      reply(`✅ User ${userToBan} has been banned from using the bot.`);
    } catch (e) {
      console.error("Ban Command Error:", e);
      reply("❌ Failed to ban the user.");
    }
  }
);

cmd(
  {
    pattern: "unban",
    desc: "Unban a user to allow them to use the bot",
    react: "✅",
    category: "owner",
    filename: __filename,
    fromMe: true, // only bot owner can unban
  },
  async (malvin, mek, m, { args, reply }) => {
    try {
      const userToUnban = args[0];
      if (!userToUnban) return reply("❌ Usage: .unban <number>");

      if (!global.bannedUsers.has(userToUnban)) {
        return reply("⚠️ This user is not banned.");
      }

      global.bannedUsers.delete(userToUnban);
      reply(`✅ User ${userToUnban} has been unbanned.`);
    } catch (e) {
      console.error("Unban Command Error:", e);
      reply("❌ Failed to unban the user.");
    }
  }
);

// Middleware to block banned users
cmd(
  {
    pattern: "any",
    dontAddCommandList: true,
  },
  async (malvin, mek, m, { from, sender, reply }) => {
    if (global.bannedUsers.has(sender)) {
      return reply("⛔ You are banned from using this bot!");
    }
  }
);