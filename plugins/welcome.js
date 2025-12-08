// plugins/welcome.js
const { cmd } = require("../command");
const fs = require("fs");

const welcomeFile = "./lib/welcome.json";

// Ensure file exists
if (!fs.existsSync(welcomeFile)) {
  fs.writeFileSync(welcomeFile, JSON.stringify({}, null, 2));
}

cmd(
  {
    pattern: "welcome",
    react: "👋",
    desc: "Turn ON/OFF welcome messages in group",
    category: "group",
    filename: __filename,
  },
  async (malvin, mek, m, { from, args, reply, isGroup, isAdmins }) => {
    if (!isGroup) return reply("❌ This command can only be used in groups.");
    if (!isAdmins) return reply("❌ Only group admins can use this command.");

    const data = JSON.parse(fs.readFileSync(welcomeFile));
    const status = args[0]?.toLowerCase();

    if (!status || !["on", "off"].includes(status)) {
      return reply(`⚡ Usage: .welcome on / off\n\n📌 Current: ${data[from]?.welcome ? "✅ ON" : "❌ OFF"}`);
    }

    if (!data[from]) data[from] = {};

    if (status === "on") {
      data[from].welcome = true;
      reply("✅ Welcome messages have been *enabled* in this group.");
    } else {
      data[from].welcome = false;
      reply("❌ Welcome messages have been *disabled* in this group.");
    }

    fs.writeFileSync(welcomeFile, JSON.stringify(data, null, 2));
  }
);
