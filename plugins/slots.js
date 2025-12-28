const fs = require("fs");
const path = require("path");
const { cmd } = require("../command");

const ECONOMY_PATH = path.join(__dirname, "../database/economy.json");

// Ensure economy file exists
function loadEconomy() {
  if (!fs.existsSync(ECONOMY_PATH)) {
    fs.writeFileSync(ECONOMY_PATH, JSON.stringify({ users: {} }, null, 2));
  }
  return JSON.parse(fs.readFileSync(ECONOMY_PATH));
}

function saveEconomy(data) {
  fs.writeFileSync(ECONOMY_PATH, JSON.stringify(data, null, 2));
}

// Slot symbols
const symbols = ["🍒", "🍋", "🍉", "⭐", "💎"];

cmd(
  {
    pattern: "slots",
    desc: "Play slots and win coins",
    category: "economy",
    react: "🎰",
    filename: __filename,
  },
  async (malvin, mek, m, { from, sender, args, reply }) => {
    const bet = parseInt(args[0]);

    if (!bet || bet <= 0) {
      return reply("🎰 *Slots*\n\nUsage:\n.slots <amount>\nExample: .slots 500");
    }

    const db = loadEconomy();

    if (!db.users[sender]) {
      db.users[sender] = { wallet: 0, bank: 0 };
    }

    const user = db.users[sender];

    if (user.wallet < bet) {
      return reply(`❌ Not enough coins!\n\n💰 Wallet: ${user.wallet}`);
    }

    // Deduct bet
    user.wallet -= bet;

    // Spin
    const roll = [
      symbols[Math.floor(Math.random() * symbols.length)],
      symbols[Math.floor(Math.random() * symbols.length)],
      symbols[Math.floor(Math.random() * symbols.length)],
    ];

    let win = 0;
    let resultText = "❌ You lost!";

    // Win logic
    if (roll[0] === roll[1] && roll[1] === roll[2]) {
      win = bet * 5;
      resultText = "🎉 *JACKPOT!*";
    } else if (
      roll[0] === roll[1] ||
      roll[1] === roll[2] ||
      roll[0] === roll[2]
    ) {
      win = bet * 2;
      resultText = "✨ *You won!*";
    }

    user.wallet += win;
    saveEconomy(db);

    const msg = `
🎰 *SLOTS MACHINE* 🎰

${roll.join(" | ")}

${resultText}

💸 Bet: ${bet}
🏆 Win: ${win}
💰 Wallet: ${user.wallet}
`.trim();

    reply(msg);
  }
);
