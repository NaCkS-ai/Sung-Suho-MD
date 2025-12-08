// plugins/sudo.js
const { cmd } = require("../command");

if (!global.sudoUsers) global.sudoUsers = new Set();

cmd(
  {
    pattern: "addsudo",
    desc: "Grant sudo access to a user",
    react: "🛡️",
    category: "owner",
    filename: __filename,
    fromMe: true, // Only bot owner
  },
  async (malvin, mek, m, { args, reply }) => {
    try {
      const userToAdd = args[0];
      if (!userToAdd) return reply("❌ Usage: .addsudo <number>");

      if (global.sudoUsers.has(userToAdd))
        return reply("⚠️ This user already has sudo access.");

      global.sudoUsers.add(userToAdd);
      reply(`✅ User ${userToAdd} has been granted sudo access.`);
    } catch (e) {
      console.error("AddSudo Error:", e);
      reply("❌ Failed to add sudo user.");
    }
  }
);

cmd(
  {
    pattern: "removesudo",
    desc: "Revoke sudo access from a user",
    react: "🛡️",
    category: "owner",
    filename: __filename,
    fromMe: true, // Only bot owner
  },
  async (malvin, mek, m, { args, reply }) => {
    try {
      const userToRemove = args[0];
      if (!userToRemove) return reply("❌ Usage: .removesudo <number>");

      if (!global.sudoUsers.has(userToRemove))
        return reply("⚠️ This user does not have sudo access.");

      global.sudoUsers.delete(userToRemove);
      reply(`✅ User ${userToRemove} has had sudo access revoked.`);
    } catch (e) {
      console.error("RemoveSudo Error:", e);
      reply("❌ Failed to remove sudo user.");
    }
  }
);

// Middleware to allow sudo users to run owner commands
cmd(
  {
    pattern: "any",
    dontAddCommandList: true,
  },
  async (malvin, mek, m, { sender, from, reply }) => {
    if (global.sudoUsers.has(sender)) {
      // Optionally: you can allow sudo users to bypass owner checks here
    }
  }
);