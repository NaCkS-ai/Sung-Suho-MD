// plugins/owner/allusers.js
const { cmd } = require("../command");
const fs = require("fs");
const path = require("path");
const config = require("../config");

const ecoFile = path.join(__dirname, "../../lib/economy.json");

// ------------------ Economy ------------------
function loadEco() {
  if (!fs.existsSync(ecoFile)) return {};
  return JSON.parse(fs.readFileSync(ecoFile));
}

// ------------------ Owner-Only Command ------------------
cmd(
  {
    pattern: "allusers",
    react: "👑",
    desc: "Owner only: Check all users globally",
    category: "owner",
    filename: __filename,
    ownerOnly: true
  },
  async (malvin, mek, m, { from, sender, reply }) => {
    try {
      if (!config.OWNER_NUMBER.includes(sender)) {
        return reply("❌ You are not authorized to use this command.");
      }

      const eco = loadEco();
      if (!eco || Object.keys(eco).length === 0) return reply("❌ No users found.");

      let msg = "🌐 *Global Users Overview* 🌐\n\n";
      let count = 0;

      for (let userId of Object.keys(eco)) {
        const u = eco[userId];
        msg += `👤 @${userId.split("@")[0]}\n`;
        msg += `💵 Wallet: ${u.wallet || 0}\n`;
        msg += `🏦 Bank: ${u.bank || 0}\n`;
        msg += `🎒 Items: ${u.inventory.length || 0}\n`;
        msg += `⚡ Pokémon: ${u.pokemon.length || 0}\n`;
        msg += `─────────────────\n`;
        count++;
      }

      msg += `📌 Total Users: ${count}`;

      await reply(msg, { mentions: Object.keys(eco) });

    } catch (err) {
      console.error(err);
      reply("❌ Failed to fetch users: " + err.message);
    }
  }
);
