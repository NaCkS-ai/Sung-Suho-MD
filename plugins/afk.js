const { cmd } = require("../command");

cmd({
  pattern: "afk",
  desc: "Set AFK status",
  category: "utility",
  filename: __filename
}, async (malvin, mek, m, { reply, args, sender }) => {
  const reason = args.join(" ") || "AFK";

  global.afk = global.afk || {};
  global.afk[sender] = {
    reason,
    time: Date.now()
  };

  reply(`💤 You are now AFK\n📌 Reason: *${reason}*`);
});
