const { cmd } = require("../command");

cmd({
  pattern: "wipeusers",
  alias: ["wipe-users"],
  desc: "Wipe all registered users",
  category: "owner",
  filename: __filename,
  owner: true
}, async (malvin, mek, m, { reply }) => {
  try {
    global.db.users = {}; // or your users array
    reply("✅ *All users have been wiped successfully.*");
  } catch (e) {
    reply("❌ Failed to wipe users.");
  }
});
