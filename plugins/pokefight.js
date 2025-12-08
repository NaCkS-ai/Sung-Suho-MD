// plugins/pokefight.js
const { cmd } = require("../command");
const fs = require("fs");
const path = require("path");

const ecoFile = path.join(__dirname, "../lib/economy.json");

// ------------------ Economy ------------------
function loadEco() {
  if (!fs.existsSync(ecoFile)) return {};
  return JSON.parse(fs.readFileSync(ecoFile));
}

function saveEco(data) {
  fs.writeFileSync(ecoFile, JSON.stringify(data, null, 2));
}

function getUserEco(user) {
  let eco = loadEco();
  if (!eco[user]) {
    eco[user] = { wallet: 500, bank: 0, inventory: [], pokemon: [], lastDaily: null, cooldowns: {} };
    saveEco(eco);
  }
  return eco[user];
}

function updateUserEco(user, newData) {
  let eco = loadEco();
  eco[user] = newData;
  saveEco(eco);
}

// ------------------ Pokémon Database ------------------
const wildPokemons = [
  { name: "Pikachu", emoji: "⚡", image: "https://img.pokemondb.net/artwork/pikachu.jpg", rarity: "Common" },
  { name: "Charmander", emoji: "🔥", image: "https://img.pokemondb.net/artwork/charmander.jpg", rarity: "Common" },
  { name: "Bulbasaur", emoji: "🌿", image: "https://img.pokemondb.net/artwork/bulbasaur.jpg", rarity: "Common" },
  { name: "Squirtle", emoji: "💧", image: "https://img.pokemondb.net/artwork/squirtle.jpg", rarity: "Common" },
  { name: "Eevee", emoji: "✨", image: "https://img.pokemondb.net/artwork/eevee.jpg", rarity: "Rare" },
  { name: "Jigglypuff", emoji: "🎤", image: "https://img.pokemondb.net/artwork/jigglypuff.jpg", rarity: "Rare" },
  { name: "Snorlax", emoji: "😴", image: "https://img.pokemondb.net/artwork/snorlax.jpg", rarity: "Rare" },
  { name: "Gengar", emoji: "👻", image: "https://img.pokemondb.net/artwork/gengar.jpg", rarity: "Legendary" },
  { name: "Mewtwo", emoji: "💎", image: "https://img.pokemondb.net/artwork/mewtwo.jpg", rarity: "Legendary" },
  { name: "Magikarp", emoji: "🐟", image: "https://img.pokemondb.net/artwork/magikarp.jpg", rarity: "Common" },
];

// ------------------ Active wild Pokémon ------------------
const activeWild = {}; // { chatId: { pokemon, owner, timeout } }

// ------------------ Spawn Pokémon ------------------
cmd(
  {
    pattern: "pokefight",
    react: "⚔️",
    desc: "Spawn a wild Pokémon for catching",
    category: "games",
    filename: __filename
  },
  async (malvin, mek, m, { from, sender, reply }) => {
    try {
      if (activeWild[from]) return reply("❌ A wild Pokémon is already present in this chat! Use .catch to catch it.");

      // Select Pokémon with rarity probabilities
      const rand = Math.random() * 100;
      let candidates;
      if (rand <= 10) candidates = wildPokemons.filter(p => p.rarity === "Legendary");
      else if (rand <= 40) candidates = wildPokemons.filter(p => p.rarity === "Rare");
      else candidates = wildPokemons.filter(p => p.rarity === "Common");

      const chosen = candidates[Math.floor(Math.random() * candidates.length)];
      const level = Math.floor(Math.random() * 10) + 1;

      activeWild[from] = { pokemon: chosen, level, owner: sender };

      await malvin.sendMessage(from, {
        image: { url: chosen.image },
        caption: `🌟 A wild ${chosen.emoji} *${chosen.name}* (Level ${level}) appeared!\n*Rarity:* ${chosen.rarity}\n\nUse .catch to catch it or a Pokéball from your inventory!`
      }, { quoted: m });

      // Auto despawn after 60 seconds
      activeWild[from].timeout = setTimeout(() => {
        delete activeWild[from];
        malvin.sendMessage(from, { text: `❌ The wild ${chosen.name} ran away!` });
      }, 60000);

    } catch (err) {
      console.error(err);
      reply("❌ Failed to spawn Pokémon: " + err.message);
    }
  }
);

// ------------------ Catch Pokémon ------------------
cmd(
  {
    pattern: "catch",
    react: "🎯",
    desc: "Catch the wild Pokémon",
    category: "games",
    filename: __filename
  },
  async (malvin, mek, m, { from, sender, reply }) => {
    try {
      const userEco = getUserEco(sender);
      const wild = activeWild[from];

      if (!wild) return reply("❌ There is no wild Pokémon in this chat! Use .pokefight to spawn one.");

      const hasPokeball = userEco.inventory.includes("Pokéball");

      // Set base catch chance by rarity
      let baseChance = 50;
      if (wild.pokemon.rarity === "Rare") baseChance = 40;
      if (wild.pokemon.rarity === "Legendary") baseChance = 20;
      if (hasPokeball) baseChance += 40; // Pokéball increases chance

      const roll = Math.floor(Math.random() * 100) + 1;

      if (roll <= baseChance) {
        // Success
        userEco.pokemon.push(`${wild.pokemon.name} (Lv ${wild.level})`);
        if (hasPokeball) {
          const index = userEco.inventory.indexOf("Pokéball");
          if (index > -1) userEco.inventory.splice(index, 1);
        }
        updateUserEco(sender, userEco);

        clearTimeout(wild.timeout);
        delete activeWild[from];

        await malvin.sendMessage(from, {
          image: { url: wild.pokemon.image },
          caption: `🎉 Congratulations! You caught a Level ${wild.level} *${wild.pokemon.name}*!\nRarity: ${wild.pokemon.rarity}\n${hasPokeball ? "🧰 Used 1 Pokéball." : ""}`
        }, { quoted: m });

      } else {
        await reply(`❌ Oh no! The wild ${wild.pokemon.name} escaped!`);
      }

    } catch (err) {
      console.error(err);
      reply("❌ Error while catching Pokémon: " + err.message);
    }
  }
);
