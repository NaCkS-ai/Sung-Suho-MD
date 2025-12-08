// plugins/economy2.js
const { cmd } = require("../command");
const fs = require("fs");
const path = require("path");

const economyFile = path.join(__dirname, "../database/economy.json");

// ===== Load & Repair Economy Data =====
function loadEconomy() {
  if (!fs.existsSync(economyFile)) {
    fs.writeFileSync(economyFile, JSON.stringify({}, null, 2));
  }

  try {
    const data = JSON.parse(fs.readFileSync(economyFile));

    // Auto-fix corrupted structure
    if (typeof data !== "object" || Array.isArray(data)) return {};

    return data;
  } catch (e) {
    fs.writeFileSync(economyFile, JSON.stringify({}, null, 2));
    return {};
  }
}

// ===== Save Economy Data =====
function saveEconomy(data) {
  fs.writeFileSync(economyFile, JSON.stringify(data, null, 2));
}

// ===== Ensure User Exists + Auto Fix =====
function getUserData(user, economy) {
  if (!economy[user]) {
    economy[user] = {
      balance: 0,
      inventory: {},
      lastDaily: 0
    };
  }

  // auto-fix corrupted balance
  if (isNaN(economy[user].balance) || typeof economy[user].balance !== "number") {
    economy[user].balance = 0;
  }

  if (!economy[user].inventory || typeof economy[user].inventory !== "object") {
    economy[user].inventory = {};
  }

  return economy[user];
}

// 💼 WORK
cmd({
  pattern: "work",
  desc: "Work to earn money",
  category: "economy",
  filename: __filename
}, async (conn, m, msg, { reply }) => {
  const user = m.sender;
  const economy = loadEconomy();
  const data = getUserData(user, economy);

  let earned = Math.floor(Math.random() * 500) + 100;
  data.balance += earned;

  saveEconomy(economy);
  reply(`💼 You worked and earned *${earned} coins!*`);
});

// 🤲 BEG
cmd({
  pattern: "beg",
  desc: "Beg for coins",
  category: "economy",
  filename: __filename
}, async (conn, m, msg, { reply }) => {
  const user = m.sender;
  const economy = loadEconomy();
  const data = getUserData(user, economy);

  if (Math.random() < 0.3) return reply("😢 Nobody gave you money this time.");

  let amount = Math.floor(Math.random() * 200) + 10;
  data.balance += amount;

  saveEconomy(economy);
  reply(`🤲 Someone gave you *${amount} coins!*`);
});

// 🏹 HUNT
cmd({
  pattern: "hunt",
  desc: "Hunt animals & treasure",
  category: "economy",
  filename: __filename
}, async (conn, m, msg, { reply }) => {
  const user = m.sender;
  const economy = loadEconomy();
  const data = getUserData(user, economy);

  const results = [
    { msg: "You hunted a deer 🦌 and sold it for 350 coins!", coins: 350, item: "deer" },
    { msg: "You found a golden egg 🥚 worth 500 coins!", coins: 500, item: "golden egg" },
    { msg: "You caught a fish 🐟 worth 200 coins!", coins: 200, item: "fish" },
    { msg: "You found nothing 😢", coins: 0 }
  ];

  const result = results[Math.floor(Math.random() * results.length)];
  data.balance += result.coins;

  if (result.item) {
    data.inventory[result.item] = (data.inventory[result.item] || 0) + 1;
  }

  saveEconomy(economy);
  reply(`🏹 ${result.msg}`);
});

// 💰 SELL ITEMS
cmd({
  pattern: "sell",
  desc: "Sell items from inventory",
  category: "economy",
  use: "<item>",
  filename: __filename
}, async (conn, m, msg, { args, reply }) => {
  const user = m.sender;
  const economy = loadEconomy();
  const data = getUserData(user, economy);

  if (!args.length) return reply("❌ Usage: .sell <item>");

  const item = args.join(" ").toLowerCase();

  const prices = {
    "deer": 350,
    "fish": 200,
    "golden egg": 500
  };

  if (!prices[item]) return reply("❌ This item cannot be sold.");

  if (!data.inventory[item] || data.inventory[item] <= 0)
    return reply("❌ You don't have that item!");

  data.inventory[item]--;
  data.balance += prices[item];

  saveEconomy(economy);
  reply(`💰 Sold *${item}* for *${prices[item]} coins!*`);
});

// 🎰 SLOTS - FULLY FIXED VERSION
cmd({
  pattern: "slots",
  desc: "Play a slot machine",
  category: "economy",
  use: "<amount>",
  filename: __filename
}, async (conn, m, msg, { args, reply }) => {
  const user = m.sender;
  const economy = loadEconomy();
  const data = getUserData(user, economy);

  const bet = parseInt(args[0]);

  if (!bet || bet <= 0) return reply("Usage: .slots <amount>");
  if (data.balance < bet) return reply("❌ You don't have enough coins!");

  const symbols = ["🍒", "🍋", "🍉", "⭐", "💎"];
  const spin = [
    symbols[Math.floor(Math.random() * symbols.length)],
    symbols[Math.floor(Math.random() * symbols.length)],
    symbols[Math.floor(Math.random() * symbols.length)]
  ];

  let msgOut = `🎰 | *${spin[0]}* | *${spin[1]}* | *${spin[2]}* |\n`;

  const allSame = spin[0] === spin[1] && spin[1] === spin[2];
  const twoSame =
    spin[0] === spin[1] ||
    spin[1] === spin[2] ||
    spin[0] === spin[2];

  if (allSame) {
    let win = bet * 5;
    data.balance += win;
    msgOut += `\n🎉 JACKPOT! You won *${win} coins!*`;
  } else if (twoSame) {
    let win = Math.floor(bet * 1.5);
    data.balance += win;
    msgOut += `\n✨ You matched 2 symbols and won *${win} coins!*`;
  } else {
    data.balance -= bet;
    msgOut += `\n😢 You lost *${bet} coins!*`;
  }

  saveEconomy(economy);
  reply(msgOut);
});