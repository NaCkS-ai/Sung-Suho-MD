const { cmd } = require("../command");

cmd({
  pattern: "richlist",
  desc: "Show top richest users",
  category: "economy",
  filename: __filename
}, async (malvin, mek, m, { reply }) => {
  try {
    const users = Object.entries(global.db.users || {})
      .sort((a, b) => (b[1].money || 0) - (a[1].money || 0))
      .slice(0, 10);

    if (!users.length) return reply("❌ No economy data found.");

    let text = "🏆 *TOP RICHEST USERS*\n\n";
    users.forEach(([jid, data], i) => {
      text += `${i + 1}. @${jid.split("@")[0]} — 💰 ${data.money || 0}\n`;
    });

    reply(text);
  } catch (e) {
    reply("❌ Error generating richlist.");
  }
});
