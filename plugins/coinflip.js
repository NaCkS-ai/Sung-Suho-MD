// plugins/coinflip.js
const { cmd } = require("../command");

cmd(
  {
    pattern: "coinflip",
    alias: ["flipcoin"],
    desc: "Flip a coin and see the result",
    react: "🪙",
    category: "fun",
    filename: __filename,
  },
  async (malvin, mek, m, { reply }) => {
    const result = Math.random() < 0.5 ? "Heads 🪙" : "Tails 🪙";
    reply(`You flipped a coin and got: *${result}*`);
  }
);