const { cmd } = require("../command");

cmd({
  pattern: "listmod",
  alias: ["list-mod", "mods"],
  desc: "List all moderators",
  category: "owner",
  filename: __filename
}, async (malvin, mek, m, { reply }) => {
  global.mods = global.mods || [];

  if (!global.mods.length)
    return reply("❌ No moderators found.");

  let text = "👮 *MODERATOR LIST*\n\n";
  global.mods.forEach((jid, i) => {
    text += `${i + 1}. @${jid.split("@")[0]}\n`;
  });

  reply(text);
});
