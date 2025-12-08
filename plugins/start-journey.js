// plugins/start-journey.js
const { cmd } = require("../command");
const fs = require("fs");
const path = require("path");

const ecoFile = path.join(__dirname, "../lib/economy.json");

// Load economy JSON
function loadEco() {
  if (!fs.existsSync(ecoFile)) return {};
  return JSON.parse(fs.readFileSync(ecoFile));
}

// Save economy JSON
function saveEco(data) {
  fs.writeFileSync(ecoFile, JSON.stringify(data, null, 2));
}

// Get or create user economy
function getUserEco(user) {
  let eco = loadEco();
  if (!eco[user]) {
    eco[user] = { wallet: 500, bank: 0, inventory: [], pokemon: [], lastDaily: null, cooldowns: {} };
    saveEco(eco);
  }
  return eco[user];
}

// Update user economy
function updateUserEco(user, newData) {
  let eco = loadEco();
  eco[user] = newData;
  saveEco(eco);
}

// ------------------ Start Journey ------------------
cmd(
  {
    pattern: "start-journey",
    react: "✨",
    desc: "Choose your starter Pokémon",
    category: "games",
    filename: __filename
  },
  async (malvin, mek, m, { from, sender, reply }) => {
    try {
      const eco = getUserEco(sender);
      
      // Check if user already has a starter Pokémon
      if (eco.pokemon && eco.pokemon.length > 0) {
        return reply("❌ You already started your journey! Your Pokémon are:\n" + (eco.pokemon.join(", ") || "None"));
      }

      // Starter Pokémon options
      const starters = [
        { name: "Charmander", emoji: "🔥" },
        { name: "Bulbasaur", emoji: "🌿" },
        { name: "Squirtle", emoji: "💧" },
        { name: "Pikachu", emoji: "⚡" }
      ];

      let message = "🌟 *Choose your starter Pokémon!* 🌟\n\n";
      starters.forEach((p, i) => {
        message += `${i + 1}. ${p.emoji} ${p.name}\n`;
      });
      message += `\nReply with 1️⃣, 2️⃣, 3️⃣ or 4️⃣ to pick your Pokémon.`;

      const sentMsg = await malvin.sendMessage(from, { text: message }, { quoted: m });
      const messageID = sentMsg.key.id;

      // Listen for user's reply
      malvin.ev.on("messages.upsert", async (msgUpdate) => {
        try {
          const mekInfo = msgUpdate?.messages[0];
          if (!mekInfo?.message) return;

          const replyText = mekInfo?.message?.conversation || mekInfo?.message?.extendedTextMessage?.text;
          const isReplyToSentMsg = mekInfo?.message?.extendedTextMessage?.contextInfo?.stanzaId === messageID;
          const userId = mekInfo.key?.fromMe ? sender : mekInfo.key?.remoteJid;

          if (!isReplyToSentMsg || userId !== sender) return;

          const choice = parseInt(replyText.trim());
          if (!choice || choice < 1 || choice > starters.length) return reply("❌ Invalid choice! Reply with 1, 2, 3 or 4.");

          // Assign starter Pokémon
          const chosen = starters[choice - 1];
          eco.pokemon.push(chosen.name);
          updateUserEco(sender, eco);

          await reply(`🎉 Congratulations! You chose ${chosen.emoji} *${chosen.name}* as your starter Pokémon!`);
        } catch (e) {
          console.error(e);
        }
      });

    } catch (error) {
      console.error(error);
      reply("❌ Failed to start journey: " + error.message);
    }
  }
);
