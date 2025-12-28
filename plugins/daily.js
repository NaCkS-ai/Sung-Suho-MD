// plugins/daily.js
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
    pattern: "daily",
    alias: [],
    desc: "Claim your daily coins reward",
    category: "economy",
    react: "🗓️",
    filename: __filename,
  },
  async (malvin, mek, m, { from, sender, reply }) => {
    try {
      const economy = readEconomy();
      const userId = sender.split("@")[0];

      const DAILY_REWARD = 100; // coins given daily
      const COOLDOWN = 24 * 60 * 60 * 1000; // 24 hours in ms

      if (!economy[userId]) {
        economy[userId] = { coins: 0, lastDaily: 0 };
      }

      const now = Date.now();
      if (economy[userId].lastDaily && now - economy[userId].lastDaily < COOLDOWN) {
        const remaining = COOLDOWN - (now - economy[userId].lastDaily);
        const hours = Math.floor(remaining / (1000 * 60 * 60));
        const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

        return await reply(
          `⏳ You've already claimed your daily reward!\nTry again in ${hours}h ${minutes}m ${seconds}s.`
        );
      }

      // Give daily reward
      economy[userId].coins = (economy[userId].coins || 0) + DAILY_REWARD;
      economy[userId].lastDaily = now;

      writeEconomy(economy);

      await reply(`🎉 You claimed your daily reward of ${DAILY_REWARD} coins!\n💰 Current Balance: ${economy[userId].coins} coins`);
    } catch (e) {
      console.error("Daily Command Error:", e);
      await reply("❌ Unable to claim daily reward.");
    }
  }
);
