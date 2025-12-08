// plugins/pokemonstore.js
const { cmd } = require("../command");
const fs = require("fs");
const path = require("path");

const dbPath = path.join(__dirname, "../lib/pokemon.json");
if (!fs.existsSync(dbPath)) fs.writeFileSync(dbPath, "{}");
let pokemonDB = JSON.parse(fs.readFileSync(dbPath));

const ecoPath = path.join(__dirname, "../lib/economy.json");
if (!fs.existsSync(ecoPath)) fs.writeFileSync(ecoPath, "{}");
let ecoDB = JSON.parse(fs.readFileSync(ecoPath));

function savePokemonDB() {
  fs.writeFileSync(dbPath, JSON.stringify(pokemonDB, null, 2));
}
function saveEcoDB() {
  fs.writeFileSync(ecoPath, JSON.stringify(ecoDB, null, 2));
}

// -------- Store Items --------
const storeItems = {
  "pokeball": { name: "Poké Ball", price: 100, effect: "Basic catch chance" },
  "greatball": { name: "Great Ball", price: 250, effect: "Better catch chance" },
  "ultraball": { name: "Ultra Ball", price: 500, effect: "High catch chance" },
  "masterball": { name: "Master Ball", price: 2000, effect: "100% catch chance" },
  "potion": { name: "Potion", price: 150, effect: "Restore 20 HP" },
  "superpotion": { name: "Super Potion", price: 300, effect: "Restore 50 HP" },
  "hyperpotion": { name: "Hyper Potion", price: 600, effect: "Restore 100 HP" },
  "revive": { name: "Revive", price: 800, effect: "Revive a fainted Pokémon" },
  "fullrestore": { name: "Full Restore", price: 1200, effect: "Fully heal + cure status" }
};

// -------- Store Command --------
cmd(
  {
    pattern: "pstore",
    desc: "Show Pokémon Store",
    category: "games",
    filename: __filename,
  },
  async (malvin, mek, m, { reply }) => {
    let list = Object.keys(storeItems)
      .map(
        (key, i) =>
          `${i + 1}. ${storeItems[key].name} - 💰 ${storeItems[key].price}\n   📝 ${storeItems[key].effect}`
      )
      .join("\n\n");

    reply(
      `🛒 *Pokémon Store*\n\n${list}\n\n💡 Buy using: .buyitem <item> <amount>`
    );
  }
);

// -------- Buy Item --------
cmd(
  {
    pattern: "buyitem",
    desc: "Buy Pokémon items",
    category: "games",
    filename: __filename,
  },
  async (malvin, mek, m, { sender, args, reply }) => {
    if (!args[0]) return reply("❌ Usage: .buyitem <item> <amount>");
    let item = args[0].toLowerCase();
    let amount = parseInt(args[1]) || 1;

    if (!storeItems[item]) return reply("❌ Item not found in store!");

    let price = storeItems[item].price * amount;

    if (!ecoDB[sender]) ecoDB[sender] = { coins: 0 };
    if (ecoDB[sender].coins < price)
      return reply(`❌ Not enough coins! You need 💰 ${price}.`);

    ecoDB[sender].coins -= price;

    if (!pokemonDB[sender]) pokemonDB[sender] = { caught: [], inventory: {} };
    if (!pokemonDB[sender].inventory) pokemonDB[sender].inventory = {};

    if (!pokemonDB[sender].inventory[item])
      pokemonDB[sender].inventory[item] = 0;
    pokemonDB[sender].inventory[item] += amount;

    saveEcoDB();
    savePokemonDB();

    reply(
      `✅ You bought ${amount}x ${storeItems[item].name} for 💰 ${price}.\nCheck inventory with *.inventory*`
    );
  }
);

// -------- Inventory --------
cmd(
  {
    pattern: "inventory",
    desc: "Show your Pokémon items",
    category: "games",
    filename: __filename,
  },
  async (malvin, mek, m, { sender, reply }) => {
    if (!pokemonDB[sender] || !pokemonDB[sender].inventory)
      return reply("❌ You don’t own any items yet.");

    let inv = Object.keys(pokemonDB[sender].inventory)
      .map(
        (key, i) =>
          `${i + 1}. ${storeItems[key]?.name || key} × ${
            pokemonDB[sender].inventory[key]
          }`
      )
      .join("\n");

    reply(`🎒 *Your Inventory:*\n\n${inv}`);
  }
);