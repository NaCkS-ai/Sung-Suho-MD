const { cmd } = require("../command");

cmd({
  pattern: "delmod",
  alias: ["del-mod"],
  desc: "Remove a moderator",
  category: "owner",
  filename: __filename,
  owner: true
}, async (malvin, mek, m, { reply, mentionedJid }) => {
  if (!mentionedJid[0]) return reply("❗ Tag a mod to remove.");

  global.mods = global.mods || [];
  global.mods = global.mods.filter(jid => jid !== mentionedJid[0]);

  reply("✅ Moderator removed.");
});
