// plugins/leaderboard.js
const { cmd } = require("../command");
const fs = require("fs");
const path = require("path");
const config = require("../config");

const ecoFile = path.join(__dirname, "../lib/economy.json");

// Load economy JSON
function loadEco() {
  if (!fs.existsSync(ecoFile)) return {};
  return JSON.parse(fs.readFileSync(ecoFile));
}

// ------------------ Leaderboard ------------------
cmd(
  {
    pattern: "lb",
    alias: ["leaderboard"],
    react: "🏆",
    desc: "Show top richest players with items & Pokémon",
    category: "economy",
    filename: __filename
  },
  async (malvin, mek, m, { reply }) => {
    try {
      const eco = loadEco();
      if (!Object.keys(eco).length) return reply("❌ No users found in the economy database.");

      // Map users to total assets
      const users = Object.keys(eco).map(u => ({
        user: u,
        wallet: eco[u].wallet || 0,
        bank: eco[u].bank || 0,
        total: (eco[u].wallet || 0) + (eco[u].bank || 0),
        inventory: eco[u].inventory || [],
        pokemon: eco[u].pokemon || [] // Assuming you have a `pokemon` array
      }));

      // Sort by total money
      users.sort((a, b) => b.total - a.total);

      let lbText = `🏆 *NOVACORE+ LEADERBOARD* 🏆\n\n`;

      users.slice(0, 10).forEach((u, i) => {
        lbText += `✨ *#${i+1}* - @${u.user.split("@")[0]}\n`;
        lbText += `💰 Wallet: ${u.wallet} | Bank: ${u.bank} | Total: ${u.total}\n`;
        lbText += `🎒 Items: ${u.inventory.length ? u.inventory.join(", ") : "None"}\n`;
        lbText += `🛡 Pokémon: ${u.pokemon.length ? u.pokemon.join(", ") : "None"}\n\n`;
      });

      lbText += `Powered by 𝑵𝑶𝑽𝑨𝑪𝑶𝑹𝑬+ ✨`;

      // Send image banner + leaderboard
      await malvin.sendMessage(
        m.chat,
        { image: { url: "https://files.catbox.moe/oz3ky3.png" }, caption: lbText, mentions: users.slice(0, 10).map(u => u.user) },
        { quoted: m }
      );

    } catch (e) {
      console.error(e);
      reply("❌ Failed to fetch leaderboard: " + e.message);
    }
  }
);
