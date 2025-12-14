const { cmd } = require("../command");

cmd({
  pattern: "addmod",
  alias: ["add-mod"],
  desc: "Add a moderator",
  category: "owner",
  filename: __filename,
  owner: true
}, async (malvin, mek, m, { reply, mentionedJid }) => {
  if (!mentionedJid[0]) return reply("❗ Tag a user to add as mod.");

  global.mods = global.mods || [];
  if (global.mods.includes(mentionedJid[0]))
    return reply("⚠️ User is already a mod.");

  global.mods.push(mentionedJid[0]);
  reply("✅ User added as moderator.");
});
