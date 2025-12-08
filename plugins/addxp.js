const { cmd } = require("../command");
const fs = require("fs");
const path = require("path");

const rankPath = path.join(__dirname, "../lib/rank.json");
if (!fs.existsSync(rankPath)) fs.writeFileSync(rankPath, "{}");
let rankDB = JSON.parse(fs.readFileSync(rankPath));

function saveRank() {
  fs.writeFileSync(rankPath, JSON.stringify(rankDB, null, 2));
}

cmd(
  {
    pattern: "addxp",
    desc: "Add XP to a user (Owner only)",
    category: "owner",
    filename: __filename,
  },
  async (conn, m, _, { args, sender, reply }) => {
    // ✅ Only owner can use
    const owner = "27649342626@s.whatsapp.net"; // replace with your WhatsApp JID
    if (sender !== owner) return reply("❌ This command is owner-only.");

    const mentioned = m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
    if (!mentioned) return reply("⚠️ Tag a user!\nUsage: .addxp @user <amount>");

    const xpToAdd = parseInt(args[1]);
    if (isNaN(xpToAdd)) return reply("❌ Please provide a valid XP amount.");

    if (!rankDB[mentioned]) rankDB[mentioned] = { xp: 0, level: 1, role: "Beginner" };
    rankDB[mentioned].xp += xpToAdd;

    saveRank();

    reply(`✅ Added *${xpToAdd} XP* to @${mentioned.split("@")[0]}`, { mentions: [mentioned] });
  }
);
