// plugins/addcoins.js
const fs = require("fs");
const path = require("path");
const { cmd } = require("../command");
const config = require("../config"); // Assuming you have OWNER_NUMBER in config

const ECONOMY_FILE = path.join(__dirname, "../economy.json");

function readEconomy() {
  if (!fs.existsSync(ECONOMY_FILE)) return {};
  return JSON.parse(fs.readFileSync(ECONOMY_FILE, "utf-8"));
}

function writeEconomy(data) {
  fs.writeFileSync(ECONOMY_FILE, JSON.stringify(data, null, 2));
}

cmd(
  {
    pattern: "addcoins",
    alias: ["addmoney", "givecoins"],
    desc: "Owner only: Add coins to a user's wallet",
    category: "economy",
    react: "💰",
    filename: __filename,
    fromMe: true, // Owner only
  },
  async (malvin, mek, m, { from, sender, args, reply }) => {
    try {
      const userId = sender.split("@")[0];

      if (userId !== config.OWNER_NUMBER) {
        return reply("❌ Only the owner can use this command.");
      }

      if (!args[0] || !args[1]) {
        return reply(
          "❌ Usage: addcoins @user <amount>\nExample: addcoins @123456789 1000"
        );
      }

      const targetMention = args[0];
      const targetId = targetMention.replace(/[^\d]/g, "");
      const amount = parseInt(args[1]);

      if (isNaN(amount) || amount <= 0) {
        return reply("❌ Please enter a valid amount of coins.");
      }

      const economy = readEconomy();

      if (!economy[targetId]) {
        economy[targetId] = { coins: 0, lastDaily: 0 };
      }

      economy[targetId].coins += amount;
      writeEconomy(economy);

      await reply(
        `✅ Successfully added ${amount} coins to @${targetId}'s wallet.`,
        { mentions: [targetMention] }
      );
    } catch (e) {
      console.error("AddCoins Command Error:", e);
      await reply("❌ Unable to add coins. Try again later.");
    }
  }
);
