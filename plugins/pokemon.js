// plugins/pokemon.js
const { cmd } = require("../command");
const fs = require("fs");
const path = require("path");
const { getUserEco, updateUserEco } = require("./economy");
const { addXP } = require("./rank");

const POKE_FILE = path.join(__dirname, "../lib/pokemon.json");
let pokeDB = fs.existsSync(POKE_FILE) ? JSON.parse(fs.readFileSync(POKE_FILE)) : {};

const MODS = [
  "27649342626@s.whatsapp.net",
  "27822972411@s.whatsapp.net",
  "27682679605@s.whatsapp.net",
  "27797004136@s.whatsapp.net"
];

const WILD_POKEMON = [
  { name: "Charmander", type: "Fire", hp: 35, img: "https://img.pokemondb.net/artwork/charmander.jpg", moves: [{ name: "Ember", type: "Fire", power: 10 }, { name: "Scratch", type: "Normal", power: 5 }] },
  { name: "Squirtle", type: "Water", hp: 40, img: "https://img.pokemondb.net/artwork/squirtle.jpg", moves: [{ name: "Water Gun", type: "Water", power: 10 }, { name: "Tackle", type: "Normal", power: 5 }] },
  { name: "Bulbasaur", type: "Grass", hp: 38, img: "https://img.pokemondb.net/artwork/bulbasaur.jpg", moves: [{ name: "Vine Whip", type: "Grass", power: 10 }, { name: "Tackle", type: "Normal", power: 5 }] }
];

const TYPE_MULTIPLIER = {
  Fire: { Grass: 1.5, Water: 0.5, Fire: 0.5 },
  Water: { Fire: 1.5, Grass: 0.5, Water: 0.5 },
  Grass: { Water: 1.5, Fire: 0.5, Grass: 0.5 },
  Normal: { Fire: 1, Water: 1, Grass: 1, Normal: 1 }
};

function saveDB() { fs.writeFileSync(POKE_FILE, JSON.stringify(pokeDB, null, 2)); }

function getUserPokemon(userId) {
  if (!pokeDB[userId]) pokeDB[userId] = { pocket: [], inventory: [], battling: {} };
  return pokeDB[userId];
}

function addPokemonToUser(userId, pokemon) {
  const user = getUserPokemon(userId);
  if (user.pocket.length < 6) user.pocket.push(pokemon);
  else user.inventory.push(pokemon);
  saveDB();
}

function calculateDamage(move, targetType) {
  return Math.floor(move.power * (TYPE_MULTIPLIER[move.type]?.[targetType] || 1));
}

// ------------------ Wild Pokémon Spawn ------------------
function spawnWild(groupId) {
  if (!pokeDB[groupId]) pokeDB[groupId] = {};
  if (!pokeDB[groupId].wild) {
    const wild = WILD_POKEMON[Math.floor(Math.random() * WILD_POKEMON.length)];
    pokeDB[groupId].wild = { ...wild, currentHp: wild.hp, maxHp: wild.hp };
    saveDB();
  }
}

// ------------------ .catch Command ------------------
cmd({
  pattern: "catch",
  desc: "Engage wild Pokémon battle",
  category: "pokemon",
  filename: __filename
}, async (malvin, mek, m, { sender, reply }) => {
  const groupId = m.chat;
  spawnWild(groupId);

  const wild = pokeDB[groupId].wild;
  const user = getUserPokemon(sender);
  if (!user.pocket[0]) return reply("❌ You have no Pokémon to battle with!");

  const userPokemon = user.pocket[0];

  // Send battle image with user Pokémon and wild Pokémon
  await reply({
    image: { url: `https://fakebattleapi.com/render?player=${userPokemon.img}&wild=${wild.img}` },
    caption: `⚔️ Wild ${wild.name} appeared!\nYour Pokémon: ${userPokemon.name}\nWild HP: ${wild.currentHp}\n\nUse:\n.use pokeball → to try catching\n.use <move> → to attack`
  });

  // Store battling info
  user.battling[groupId] = { wild, active: userPokemon };
  saveDB();
});

// ------------------ .use Command ------------------
cmd({
  pattern: "use",
  desc: "Attack or use Pokéball",
  category: "pokemon",
  filename: __filename
}, async (malvin, mek, m, { sender, args, reply }) => {
  const groupId = m.chat;
  const user = getUserPokemon(sender);
  if (!user.battling[groupId]) return reply("❌ You are not in a battle.");

  const battle = user.battling[groupId];
  const wild = battle.wild;
  const activePokemon = battle.active;

  if (!args[0]) return reply("❌ Usage: .use <move/pokeball>");
  const action = args.join(" ").toLowerCase();

  // Use Pokéball
  if (action === "pokeball") {
    if (Math.random() < 0.5) {
      addPokemonToUser(sender, wild);
      delete user.battling[groupId];
      saveDB();
      return reply(`✅ You caught ${wild.name}!`);
    } else {
      return reply(`❌ ${wild.name} escaped the Pokéball!`);
    }
  }

  // Use move
  const move = activePokemon.moves.find(mv => mv.name.toLowerCase() === action);
  if (!move) return reply("❌ Move not found!");

  const dmg = calculateDamage(move, wild.type);
  wild.currentHp -= dmg;

  if (wild.currentHp <= 0) {
    const eco = getUserEco(sender);
    eco.wallet += 50;
    updateUserEco(sender, eco);
    addXP(sender, 20);
    addPokemonToUser(sender, wild);
    delete user.battling[groupId];
    saveDB();
    return reply(`🎉 ${wild.name} fainted! You earned 50 coins & 20 XP and caught it!`);
  }

  // Update wild HP
  battle.wild = wild;
  user.battling[groupId] = battle;
  saveDB();
  reply(`💥 ${activePokemon.name} used ${move.name}!\n${wild.name} HP: ${wild.currentHp}`);
});
