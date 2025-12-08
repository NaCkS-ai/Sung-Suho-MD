// plugins/mypokemon.js
const { cmd } = require("../command");
const fs = require("fs");
const path = require("path");

const ecoFile = path.join(__dirname, "../lib/economy.json");

// ------------------ Economy ------------------
function loadEco() {
  if (!fs.existsSync(ecoFile)) return {};
  return JSON.parse(fs.readFileSync(ecoFile));
}

function getUserEco(user) {
  let eco = loadEco();
  if (!eco[user]) {
    eco[user] = { wallet: 500, bank: 0, inventory: [], pokemon: [], lastDaily: null, cooldowns: {} };
  }
  return eco[user];
}

// ------------------ Pokémon Database ------------------
const pokemonDB = {
  "Pikachu": { emoji: "⚡", image: "https://img.pokemondb.net/artwork/pikachu.jpg", rarity: "Common" },
  "Charmander": { emoji: "🔥", image: "https://img.pokemondb.net/artwork/charmander.jpg", rarity: "Common" },
  "Bulbasaur": { emoji: "🌿", image: "https://img.pokemondb.net/artwork/bulbasaur.jpg", rarity: "Common" },
  "Squirtle": { emoji: "💧", image: "https://img.pokemondb.net/artwork/squirtle.jpg", rarity: "Common" },
  "Eevee": { emoji: "✨", image: "https://img.pokemondb.net/artwork/eevee.jpg", rarity: "Rare" },
  "Jigglypuff": { emoji: "🎤", image: "https://img.pokemondb.net/artwork/jigglypuff.jpg", rarity: "Rare" },
  "Snorlax": { emoji: "😴", image: "https://img.pokemondb.net/artwork/snorlax.jpg", rarity: "Rare" },
  "Gengar": { emoji: "👻", image: "https://img.pokemondb.net/artwork/gengar.jpg", rarity: "Legendary" },
  "Mewtwo": { emoji: "💎", image: "https://img.pokemondb.net/artwork/mewtwo.jpg", rarity: "Legendary" },
  "Magikarp": { emoji: "🐟", image: "https://img.pokemondb.net/artwork/magikarp.jpg", rarity: "Common" }
};

// ------------------ My Pokémon Command ------------------
cmd(
  {
    pattern: "mypokemon",
    react: "🗃️",
    desc: "Show all your Pokémon",
    category: "games",
    filename: __filename
  },
  async (malvin, mek, m, { from, sender, reply }) => {
    try {
      const eco = getUserEco(sender);

      if (!eco.pokemon || eco.pokemon.length === 0) return reply("❌ You haven't caught any Pokémon yet! Use .pokefight to catch some.");

      let listMessage = "🌟 *Your Pokémon Collection* 🌟\n\n";

      for (let p of eco.pokemon) {
        // p format: "Name (Lv X)"
        const nameMatch = p.match(/^(.+?)\s*\(Lv\s*(\d+)\)/);
        let name = p;
        let level = "Unknown";
        if (nameMatch) {
          name = nameMatch[1];
          level = nameMatch[2];
        }

        const pokeInfo = pokemonDB[name] || { emoji: "❓", image: "", rarity: "Unknown" };
        listMessage += `${pokeInfo.emoji} *${name}* (Lv ${level}) - *Rarity:* ${pokeInfo.rarity}\n`;
      }

      // Send first Pokémon image as banner
      const firstPoke = eco.pokemon[0].match(/^(.+?)\s*\(Lv\s*(\d+)\)/)[1];
      const firstImage = pokemonDB[firstPoke]?.image || null;

      if (firstImage) {
        await malvin.sendMessage(from, { image: { url: firstImage }, caption: listMessage }, { quoted: m });
      } else {
        await reply(listMessage);
      }

    } catch (err) {
      console.error(err);
      reply("❌ Failed to retrieve your Pokémon: " + err.message);
    }
  }
);
