const { cmd } = require("../command");
const fs = require("fs");
const path = require("path");

const ecoFile = path.join(__dirname, "../lib/economy.json");
if (!fs.existsSync(ecoFile)) fs.writeFileSync(ecoFile, "{}");
let ecoDB = JSON.parse(fs.readFileSync(ecoFile));

const cardsFile = path.join(__dirname, "../lib/animeCards.json");
if (!fs.existsSync(cardsFile)) fs.writeFileSync(cardsFile, "{}");
let cardsDB = JSON.parse(fs.readFileSync(cardsFile));

function getUserEco(userId) {
  if (!ecoDB[userId]) ecoDB[userId] = { wallet: 500, bank: 0, inventory: [], lastDaily: null, cooldowns: {} };
  return ecoDB[userId];
}

function getUserCards(userId) {
  if (!cardsDB[userId]) cardsDB[userId] = { collection: [] };
  return cardsDB[userId];
}

function saveEco() { fs.writeFileSync(ecoFile, JSON.stringify(ecoDB, null, 2)); }
function saveCards() { fs.writeFileSync(cardsFile, JSON.stringify(cardsDB, null, 2)); }

// Card definitions
const cardPool = [
  { name: "Naruto", rarity: "Common", value: 100 },
  { name: "Sasuke", rarity: "Rare", value: 300 },
  { name: "Sakura", rarity: "Common", value: 120 },
  { name: "Itachi", rarity: "Epic", value: 800 },
  { name: "Goku", rarity: "Rare", value: 350 },
  { name: "Vegeta", rarity: "Epic", value: 900 },
  { name: "Luffy", rarity: "Legendary", value: 1500 },
  { name: "Zoro", rarity: "Epic", value: 850 },
  { name: "Saitama", rarity: "Legendary", value: 2000 },
];

// VIP-only cards
const vipCards = [
  { name: "Demon Slayer Tanjiro", rarity: "Legendary", value: 3000 },
  { name: "One Punch Blast", rarity: "Legendary", value: 3500 }
];

// ------------------ Pull Card ------------------
cmd(
  { pattern: "pullcard", desc: "Pull a random anime card (500 coins)", category: "games", filename: __filename },
  async (conn, m, _, { sender, reply }) => {
    let eco = getUserEco(sender);
    if (eco.wallet < 500) return reply("❌ You need 500 coins to pull a card!");
    eco.wallet -= 500;

    const roll = Math.random() * 100;
    let card;
    if (eco.wallet >= 10000 && roll > 90) {
      // chance to get VIP card for VIP users
      card = vipCards[Math.floor(Math.random() * vipCards.length)];
    } else if (roll < 50) card = cardPool.find(c => c.rarity === "Common");
    else if (roll < 75) card = cardPool.find(c => c.rarity === "Rare");
    else if (roll < 90) card = cardPool.find(c => c.rarity === "Epic");
    else card = cardPool.find(c => c.rarity === "Legendary");

    let userCards = getUserCards(sender);
    userCards.collection.push(card);

    saveEco();
    saveCards();

    reply(`🎴 You pulled a *${card.rarity}* card: **${card.name}**!\n💵 Coins left: ${eco.wallet}`);
  }
);

// ------------------ My Cards ------------------
cmd(
  { pattern: "mycards", desc: "Show your anime card collection", category: "games", filename: __filename },
  async (conn, m, _, { sender, reply }) => {
    const userCards = getUserCards(sender);
    if (!userCards.collection.length) return reply("😢 You have no cards yet!");
    let list = userCards.collection.map((c, i) => `${i + 1}. ${c.name} (${c.rarity})`).join("\n");
    reply(`🎴 *Your Anime Cards:*\n\n${list}`);
  }
);

// ------------------ Sell Card ------------------
cmd(
  { pattern: "sellcard", desc: "Sell a card for coins", category: "games", filename: __filename },
  async (conn, m, _, { sender, args, reply }) => {
    const userCards = getUserCards(sender);
    const eco = getUserEco(sender);
    const index = parseInt(args[0]) - 1;
    if (!userCards.collection[index]) return reply("❌ Invalid card index!");
    const card = userCards.collection.splice(index, 1)[0];
    eco.wallet += card.value;

    saveEco();
    saveCards();

    reply(`💰 You sold **${card.name} (${card.rarity})** for ${card.value} coins!\n💵 Wallet: ${eco.wallet}`);
  }
);

// ------------------ Card Battle ------------------
cmd(
  { pattern: "cardbattle", desc: "Challenge another user to a card battle", category: "games", filename: __filename },
  async (conn, m, _, { sender, args, reply }) => {
    if (!args[0]) return reply("Usage: .cardbattle @user");
    const target = args[0].replace(/[@]/g, "") + "@s.whatsapp.net";
    if (target === sender) return reply("❌ You can't battle yourself!");

    const userCards = getUserCards(sender).collection;
    const targetCards = getUserCards(target).collection;
    if (!userCards.length || !targetCards.length) return reply("❌ Both players must have at least 1 card!");

    const userCard = userCards[Math.floor(Math.random() * userCards.length)];
    const targetCard = targetCards[Math.floor(Math.random() * targetCards.length)];

    const cardPower = { Common: 1, Rare: 2, Epic: 3, Legendary: 4 };
    const winner = cardPower[userCard.rarity] > cardPower[targetCard.rarity] ? sender
                 : cardPower[userCard.rarity] < cardPower[targetCard.rarity] ? target
                 : Math.random() > 0.5 ? sender : target;

    const ecoWinner = getUserEco(winner);
    ecoWinner.wallet += 500;

    saveEco();

    reply(`⚔️ *Card Battle!*\n\nYou: ${userCard.name} (${userCard.rarity})\nOpponent: ${targetCard.name} (${targetCard.rarity})\n\n🏆 Winner: @${winner.split("@")[0]} +500 coins`, { mentions: [sender, target, winner] });
  }
);

// ------------------ Trade Cards ------------------
cmd(
  { pattern: "tradecard", desc: "Trade a card with another user", category: "games", filename: __filename },
  async (conn, m, _, { sender, args, reply }) => {
    if (args.length < 3) return reply("Usage: .tradecard @user <yourCardIndex> <theirCardIndex>");
    const target = args[0].replace(/[@]/g, "") + "@s.whatsapp.net";
    if (target === sender) return reply("❌ You can't trade with yourself!");

    const yourIndex = parseInt(args[1]) - 1;
    const theirIndex = parseInt(args[2]) - 1;

    const yourCards = getUserCards(sender).collection;
    const theirCards = getUserCards(target).collection;

    if (!yourCards[yourIndex] || !theirCards[theirIndex]) return reply("❌ Invalid card index!");

    const temp = yourCards[yourIndex];
    yourCards[yourIndex] = theirCards[theirIndex];
    theirCards[theirIndex] = temp;

    saveCards();
    reply(`✅ Trade complete!\nYou gave **${theirCards[theirIndex].name}** and received **${yourCards[yourIndex].name}**`, { mentions: [sender, target] });
  }
);
