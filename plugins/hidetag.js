// plugins/hidetag.js
const { cmd } = require("../command");

cmd(
  {
    pattern: "hidetag",
    react: "📢",
    desc: "Mention all group members without showing usernames",
    category: "group",
    filename: __filename,
  },
  async (malvin, mek, m, { from, isGroup, isAdmins, participants, q, reply }) => {
    if (!isGroup) return reply("❌ This command can only be used in groups.");
    if (!isAdmins) return reply("❌ Only admins can use this command.");

    const message = q ? q : "📢 Attention everyone!";
    const memberIds = participants.map((u) => u.id);

    await malvin.sendMessage(
      from,
      {
        text: message,
        mentions: memberIds,
      },
      { quoted: mek }
    );
  }
);
