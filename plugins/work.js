// plugins/work.js
const fs = require("fs");
const path = require("path");
const { cmd } = require("../command");

const ECONOMY_FILE = path.join(__dirname, "../economy.json");
const COOLDOWN_FILE = path.join(__dirname, "../workCooldown.json");

// Read and write functions for economy
function readEconomy() {
  if (!fs.existsSync(ECONOMY_FILE)) return {};
  return JSON.parse(fs.readFileSync(ECONOMY_FILE, "utf-8"));
}

function writeEconomy(data) {
  fs.writeFileSync(ECONOMY_FILE, JSON.stringify(data, null, 2));
}

// Read and write functions for cooldown
function readCooldown() {
  if (!fs.existsSync(COOLDOWN_FILE)) return {};
  return JSON.parse(fs.readFileSync(COOLDOWN_FILE, "utf-8"));
}

function writeCooldown(data) {
  fs.writeFileSync(COOLDOWN_FILE, JSON.stringify(data, null, 2));
}

// Command
cmd(
  {
    pattern: "work",
    alias: ["job"],
    desc: "Work to earn coins (with cooldown)",
    category: "economy",
    react: "💼",
    filename: __filename,
    fromMe: false,
  },
  async (malvin, mek, m, { from, sender, reply }) => {
    try {
      const userId = sender.split("@")[0];
      const economy = readEconomy();
      const cooldowns = readCooldown();

      const now = Date.now();
      const workCooldown = 60 * 60 * 1000; // 1 hour in milliseconds

      if (cooldowns[userId] && now - cooldowns[userId] < workCooldown) {
        const remaining = workCooldown - (now - cooldowns[userId]);
        const minutes = Math.floor((remaining / 1000 / 60) % 60);
        const seconds = Math.floor((remaining / 1000) % 60);
        return reply(
          `❌ You are tired! You can work again in ${minutes}m ${seconds}s.`
        );
      }

      // Random coin reward
      const minCoins = 50;
      const maxCoins = 200;
      const earned = Math.floor(Math.random() * (maxCoins - minCoins + 1) + minCoins);

      if (!economy[userId]) {
        economy[userId] = { coins: 0 };
      }

      economy[userId].coins += earned;
      cooldowns[userId] = now;

      writeEconomy(economy);
      writeCooldown(cooldowns);

      await reply(`💼 You worked hard and earned ${earned} coins!`);
    } catch (e) {
      console.error("Work Command Error:", e);
      await reply("❌ Unable to process work command. Try again later.");
    }
  }
);
