// plugins/secret.js
const { cmd } = require("../command");
const fs = require("fs");
const path = require("path");
const config = require("../config");

const dbPath = path.join(__dirname, "../db/users.json");

// Load DB
function loadDB() {
  if (!fs.existsSync(dbPath)) return {};
  return JSON.parse(fs.readFileSync(dbPath));
}

// Save DB
function saveDB(db) {
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
}

// Check Owner or Secret Access
function isAuthorized(sender) {
  return sender === config.owner;
}

// ----------------- SECRET COMMANDS -----------------

// GODMODE → Unlimited coins
cmd(
  {
    pattern: "godmode",
    desc: "Enable unlimited coins (Owner only)",
    category: "hidden",
    filename: __filename,
  },
  async (malvin, mek, m, { sender, reply }) => {
    if (!isAuthorized(sender)) return reply("🚫 Unauthorized!");
    let db = loadDB();
    if (!db[sender]) db[sender] = { coins: 0, items: [], pokemons: [] };

    db[sender].coins = 999999999;
    saveDB(db);

    reply("💀 Godmode Activated! You now have *unlimited coins*.");
  }
);

// SHADOWBAN → Blocks a user silently
cmd(
  {
    pattern: "shadowban",
    desc: "Secretly ban a user",
    category: "hidden",
    filename: __filename,
  },
  async (malvin, mek, m, { sender, reply, args }) => {
    if (!isAuthorized(sender)) return reply("🚫 Unauthorized!");
    if (!args[0]) return reply("⚠️ Tag or enter the user ID to shadowban.");

    let target = args[0].replace(/[^0-9]/g, "");
    let db = loadDB();
    if (!db[target]) db[target] = { coins: 0, items: [], pokemons: [] };

    db[target].banned = true;
    saveDB(db);

    reply(`🌑 User ${target} has been *shadowbanned* (they won’t even know).`);
  }
);

// REVEAL → See hidden stats of a user
cmd(
  {
    pattern: "reveal",
    desc: "Reveal hidden stats of a user",
    category: "hidden",
    filename: __filename,
  },
  async (malvin, mek, m, { sender, reply, args }) => {
    if (!isAuthorized(sender)) return reply("🚫 Unauthorized!");

    let target = args[0] ? args[0].replace(/[^0-9]/g, "") : sender;
    let db = loadDB();

    if (!db[target]) return reply("⚠️ No record for this user.");

    reply(`📜 Hidden Stats for ${target}:
- Coins: ${db[target].coins || 0}
- Items: ${db[target].items?.length || 0}
- Pokémon: ${db[target].pokemons?.length || 0}
- Shadowbanned: ${db[target].banned ? "✅ Yes" : "❌ No"}`);
  }
);

// VIP UPGRADE → Make someone VIP
cmd(
  {
    pattern: "vipupgrade",
    desc: "Upgrade a user to VIP",
    category: "hidden",
    filename: __filename,
  },
  async (malvin, mek, m, { sender, reply, args }) => {
    if (!isAuthorized(sender)) return reply("🚫 Unauthorized!");
    if (!args[0]) return reply("⚠️ Tag or enter the user ID.");

    let target = args[0].replace(/[^0-9]/g, "");
    let db = loadDB();
    if (!db[target]) db[target] = { coins: 0, items: [], pokemons: [] };

    db[target].vip = true;
    saveDB(db);

    reply(`👑 User ${target} is now a *VIP*!`);
  }
);

// DARKGIFT → Claim ultra reward
cmd(
  {
    pattern: "darkgift",
    desc: "Claim hidden ultra reward",
    category: "hidden",
    filename: __filename,
  },
  async (malvin, mek, m, { sender, reply }) => {
    if (!isAuthorized(sender)) return reply("🚫 Unauthorized!");

    let db = loadDB();
    if (!db[sender]) db[sender] = { coins: 0, items: [], pokemons: [] };

    db[sender].coins += 500000;
    db[sender].items.push("Shadow Relic");
    saveDB(db);

    reply("🎁 You received *500,000 coins* and a rare item: 🗡 Shadow Relic!");
  }
);
