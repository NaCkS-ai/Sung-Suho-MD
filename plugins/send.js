// plugins/send.js
const fs = require("fs");
const path = require("path");
const { cmd } = require("../command");

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
    pattern: "send",
    alias: ["pay", "transfer"],
    desc: "Send coins to another user",
    category: "economy",
    react: "💸",
    filename: __filename,
  },
  async (malvin, mek, m, { from, sender, args, reply }) => {
    try {
      const economy = readEconomy();
      const userId = sender.split("@")[0];

      if (!args[0] || !args[1]) {
        return reply(
          "❌ Usage: send @user <amount>\nExample: send @123456789 100"
        );
      }

      const targetMention = args[0];
      const targetId = targetMention.replace(/[^\d]/g, "");
      const amount = parseInt(args[1]);

      if (isNaN(amount) || amount <= 0) {
        return reply("❌ Please enter a valid amount of coins to send.");
      }

      if (!economy[userId]) economy[userId] = { coins: 0, lastDaily: 0 };
      if (!economy[targetId]) economy[targetId] = { coins: 0, lastDaily: 0 };

      if (economy[userId].coins < amount) {
        return reply("❌ You don’t have enough coins to send.");
      }

      // Transfer coins
      economy[userId].coins -= amount;
      economy[targetId].coins += amount;

      writeEconomy(economy);

      await reply(
        `✅ Successfully sent ${amount} coins to @${targetId}!\n💰 Your balance: ${economy[userId].coins} coins`,
        { mentions: [targetMention] }
      );
    } catch (e) {
      console.error("Send Command Error:", e);
      await reply("❌ Unable to send coins. Try again later.");
    }
  }
);
