// plugins/roll.js
const { cmd } = require("../command");

cmd(
  {
    pattern: "roll",
    alias: ["dice"],
    desc: "Roll a dice and see the number",
    react: "🎲",
    category: "fun",
    filename: __filename,
  },
  async (malvin, mek, m, { reply }) => {
    const diceRoll = Math.floor(Math.random() * 6) + 1; // 1-6
    reply(`🎲 You rolled a *${diceRoll}*`);
  }
);