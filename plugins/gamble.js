const fs = require("fs");
const path = require("path");
const { cmd } = require("../command");

const ECONOMY_PATH = path.join(__dirname, "../database/economy.json");

// Ensure economy file exists
function loadEconomy() {
  if (!fs.existsSync(ECONOMY_PATH)) {
    fs.writeFileSync(ECONOMY_PATH, JSON.stringify({}, null, 2));
  }
  return JSON.parse(fs.readFileSync(ECONOMY_PATH));
}

function saveEconomy(data) {
  fs.writeFileSync(ECONOMY_PATH, JSON.stringify(data, null, 2));
}

cmd(
  {
    pattern: "gamble",
    desc: "Gamble your coins (50% chance to win or lose)",
    category: "economy",
    react: "🎲",
    filename: __filename,
  },
  async (malvin, mek, m, { from, args, reply, sender }) => {
    try {
      const amount = parseInt(args[0]);

      if (!amount || amount <= 0) {
        return reply("❌ Usage: .gamble <amount>\nExample: .gamble 500");
      }

      const economy = loadEconomy();

      if (!economy[sender]) {
        economy[sender] = { wallet: 0 };
      }

      if (economy[sender].wallet < amount) {
        return reply("❌ You don't have enough coins in your wallet.");
      }

      // 50/50 chance
      const win = Math.random() < 0.5;

      if (win) {
        economy[sender].wallet += amount;
        saveEconomy(economy);

        return reply(
          `🎉 *YOU WON!* 🎉\n\n💰 Bet: ${amount}\n➕ Won: ${amount}\n\n💼 New Balance: ${economy[sender].wallet}`
        );
      } else {
        economy[sender].wallet -= amount;
        saveEconomy(economy);

        return reply(
          `💀 *YOU LOST!* 💀\n\n💰 Bet: ${amount}\n➖ Lost: ${amount}\n\n💼 New Balance: ${economy[sender].wallet}`
        );
      }
    } catch (e) {
      console.error("Gamble Error:", e);
      reply("❌ An error occurred while gambling. Try again later.");
    }
  }
);
