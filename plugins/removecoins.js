// plugins/removecoins.js
const fs = require("fs");
const path = require("path");
const { cmd } = require("../command");
const config = require("../config");

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
    pattern: "removecoins",
    alias: ["removemoney", "takecoins"],
    desc: "Owner only: Remove coins from a user's wallet",
    category: "economy",
    react: "💸",
    filename: __filename,
    fromMe: true, // Only owner
  },
  async (malvin, mek, m, { from, sender, args, reply }) => {
    try {
      const ownerNumber = config.OWNER_NUMBER.replace(/\D/g, "");
      const userNumber = sender.split("@")[0];

      if (userNumber !== ownerNumber) {
        return reply("❌ Only the owner can use this command.");
      }

      if (!args[0] || !args[1]) {
        return reply(
          "❌ Usage: removecoins @user <amount>\nExample: removecoins @123456789 500"
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
        return reply("❌ This user has no coins in their wallet.");
      }

      economy[targetId].coins = Math.max(0, economy[targetId].coins - amount);
      writeEconomy(economy);

      await reply(
        `✅ Successfully removed ${amount} coins from @${targetId}'s wallet.`,
        { mentions: [targetMention] }
      );
    } catch (e) {
      console.error("RemoveCoins Command Error:", e);
      await reply("❌ Unable to remove coins. Try again later.");
    }
  }
);
