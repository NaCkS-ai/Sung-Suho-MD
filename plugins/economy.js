// plugins/economy.js
const { cmd } = require("../command");
const fs = require("fs");
const path = require("path");

const economyFile = path.join(__dirname, "../database/economy.json");

// ===== Economy Storage =====
function loadEconomy() {
  if (!fs.existsSync(economyFile)) {
    fs.writeFileSync(economyFile, JSON.stringify({ users: {} }, null, 2));
  }
  return JSON.parse(fs.readFileSync(economyFile));
}

function saveEconomy(data) {
  fs.writeFileSync(economyFile, JSON.stringify(data, null, 2));
}

function getUser(userId) {
  let data = loadEconomy();
  if (!data.users[userId]) {
    data.users[userId] = { coins: 0, xp: 0, level: 1, pokemons: [] };
    saveEconomy(data);
  }
  return data.users[userId];
}

function updateUser(userId, updates) {
  let data = loadEconomy();
  let user = getUser(userId);
  Object.assign(user, updates);
  data.users[userId] = user;
  saveEconomy(data);
  return user;
}

// ===== Utility Functions =====
function addCoins(userId, amount) {
  let user = getUser(userId);
  user.coins += amount;
  updateUser(userId, user);
  return user.coins;
}

function removeCoins(userId, amount) {
  let user = getUser(userId);
  user.coins = Math.max(0, user.coins - amount);
  updateUser(userId, user);
  return user.coins;
}

function addXP(userId, amount) {
  let user = getUser(userId);
  user.xp += amount;

  while (user.xp >= 200) {
    user.level++;
    user.xp -= 200;
  }

  updateUser(userId, user);
  return { xp: user.xp, level: user.level };
}

// ===== OWNER LIST =====
const OWNERS = [
  "27649342626@s.whatsapp.net",
  "27822972411@s.whatsapp.net",
  "27682679605@s.whatsapp.net",
  "27797004136@s.whatsapp.net"
];

// -------- Fix: Correct sender variable --------
function isOwner(sender) {
  return OWNERS.includes(sender);
}

// ===== Commands =====

// Wallet
cmd({
  pattern: "wallet",
  desc: "Check your wallet balance",
  category: "economy",
  filename: __filename
}, async (conn, m, msg, { reply }) => {
  const sender = msg.sender;
  let user = getUser(sender);
  reply(`💰 Wallet: ${user.coins} coins\n⭐ XP: ${user.xp}/200\n📈 Level: ${user.level}`);
});

// Daily
cmd({
  pattern: "daily",
  desc: "Claim daily reward",
  category: "economy",
  filename: __filename
}, async (conn, m, msg, { reply }) => {
  const sender = msg.sender;
  let reward = Math.floor(Math.random() * 100) + 50;

  let coins = addCoins(sender, reward);
  addXP(sender, 20);

  reply(`🎁 You claimed *${reward} coins*! New Balance: ${coins}`);
});

// Send coins
cmd({
  pattern: "send",
  desc: "Send coins to another user",
  category: "economy",
  use: "@tag <amount>",
  filename: __filename
}, async (conn, m, msg, { args, reply }) => {
  if (args.length < 2) return reply("Usage: .send @user <amount>");

  let target = m.mentionedJid?.[0];
  if (!target) return reply("❌ Tag a user.");

  let amount = parseInt(args[1]);
  if (isNaN(amount)) return reply("❌ Invalid amount.");

  let user = getUser(msg.sender);
  if (user.coins < amount) return reply("❌ Not enough coins.");

  removeCoins(msg.sender, amount);
  addCoins(target, amount);

  reply(`✅ Sent *${amount} coins* to @${target.split("@")[0]}`, null, { mentions: [target] });
});

// Add coins (Owner only)
cmd({
  pattern: "addcoins",
  desc: "Add coins to a user (Owner only)",
  category: "economy",
  filename: __filename
}, async (conn, m, msg, { args, reply }) => {
  if (!isOwner(msg.sender)) return reply("❌ Owner only.");

  let target = m.mentionedJid?.[0];
  let amount = parseInt(args[1]);

  if (!target || isNaN(amount)) return reply("Usage: .addcoins @user <amount>");

  let coins = addCoins(target, amount);
  reply(`💰 Added *${amount} coins* to @${target.split("@")[0]} (Balance: ${coins})`, null, { mentions: [target] });
});

// Remove coins (Owner only)
cmd({
  pattern: "removecoins",
  desc: "Remove coins from user (Owner only)",
  category: "economy",
  filename: __filename
}, async (conn, m, msg, { args, reply }) => {
  if (!isOwner(msg.sender)) return reply("❌ Owner only.");

  let target = m.mentionedJid?.[0];
  let amount = parseInt(args[1]);

  if (!target || isNaN(amount)) return reply("Usage: .removecoins @user <amount>");

  let coins = removeCoins(target, amount);
  reply(`💰 Removed *${amount} coins* from @${target.split("@")[0]} (Balance: ${coins})`, null, { mentions: [target] });
});

// Reset user (Owner only)
cmd({
  pattern: "resetuser",
  desc: "Reset a user's economy",
  category: "economy",
  filename: __filename
}, async (conn, m, msg, { reply }) => {
  if (!isOwner(msg.sender)) return reply("❌ Owner only.");

  let target = m.mentionedJid?.[0];
  if (!target) return reply("❌ Tag a user.");

  let data = loadEconomy();
  delete data.users[target];
  saveEconomy(data);

  reply(`♻️ Reset economy for @${target.split("@")[0]}`, null, { mentions: [target] });
});

// Reset ALL (Owner only)
cmd({
  pattern: "resetall",
  desc: "Reset ALL economy data",
  category: "economy",
  filename: __filename
}, async (conn, m, msg, { reply }) => {
  if (!isOwner(msg.sender)) return reply("❌ Owner only.");

  saveEconomy({ users: {} });
  reply("♻️ Reset ALL economy data!");
});