// plugins/games.js
const { cmd } = require("../command");
const fs = require("fs");
const path = require("path");

const ecoFile = path.join(__dirname, "../lib/economy.json");

// ---- Load Economy Database ----
let ecoDB = {};
if (fs.existsSync(ecoFile)) {
  ecoDB = JSON.parse(fs.readFileSync(ecoFile));
}

function saveEco() {
  fs.writeFileSync(ecoFile, JSON.stringify(ecoDB, null, 2));
}

function getUserEco(userId) {
  if (!ecoDB[userId]) {
    ecoDB[userId] = {
      wallet: 500,
      bank: 0,
      inventory: [],
      lastDaily: null,
      cooldowns: {}
    };
    saveEco();
  }
  // Prevent undefined values
  ecoDB[userId].wallet = ecoDB[userId].wallet || 0;
  ecoDB[userId].bank = ecoDB[userId].bank || 0;
  return ecoDB[userId];
}

function updateUserEco(userId, data) {
  ecoDB[userId] = data;
  saveEco();
}

// ---- Validate Bet ----
function validateBet(bet, eco, reply) {
  if (isNaN(bet) || bet <= 0) {
    reply("❌ Invalid bet amount.");
    return false;
  }
  if (eco.wallet < bet) {
    reply(`❌ You don't have enough coins!\n💵 Wallet: ${eco.wallet}`);
    return false;
  }
  return true;
}

// -------- Dice Roll --------
cmd(
  {
    pattern: "dice",
    desc: "Roll a dice 🎲",
    category: "games",
    filename: __filename,
  },
  async (malvin, mek, m, { sender, reply, args }) => {

    let bet = parseInt(args[0]) || 100;
    let eco = getUserEco(sender);

    if (!validateBet(bet, eco, reply)) return;

    let roll = Math.floor(Math.random() * 6) + 1;

    if (roll >= 4) {
      eco.wallet += bet;
      updateUserEco(sender, eco);
      reply(`🎲 You rolled *${roll}*!\n🎉 You WON ${bet} coins!\n💵 Wallet: ${eco.wallet}`);
    } else {
      eco.wallet -= bet;
      updateUserEco(sender, eco);
      reply(`🎲 You rolled *${roll}*!\n😢 You LOST ${bet} coins.\n💵 Wallet: ${eco.wallet}`);
    }
  }
);

// -------- Coin Flip --------
cmd(
  {
    pattern: "coinflip",
    alias: ["flip"],
    desc: "Flip a coin 🪙",
    category: "games",
    filename: __filename,
  },
  async (malvin, mek, m, { sender, reply, args }) => {

    let choice = args[0]?.toLowerCase();
    if (!choice || !["heads", "tails"].includes(choice))
      return reply("Usage: `.coinflip <heads|tails> <bet>`");

    let bet = parseInt(args[1]) || 100;
    let eco = getUserEco(sender);

    if (!validateBet(bet, eco, reply)) return;

    let result = Math.random() < 0.5 ? "heads" : "tails";

    if (choice === result) {
      eco.wallet += bet;
      updateUserEco(sender, eco);
      reply(`🪙 It landed on *${result}*\n🎉 You WON ${bet} coins!\n💵 Wallet: ${eco.wallet}`);
    } else {
      eco.wallet -= bet;
      updateUserEco(sender, eco);
      reply(`🪙 It landed on *${result}*\n😢 You LOST ${bet} coins.\n💵 Wallet: ${eco.wallet}`);
    }
  }
);

// -------- Rock Paper Scissors --------
cmd(
  {
    pattern: "rps",
    desc: "Play Rock Paper Scissors ✊✋✌️",
    category: "games",
    filename: __filename,
  },
  async (malvin, mek, m, { sender, args, reply }) => {

    const choices = ["rock", "paper", "scissors"];

    if (!args[0]) return reply("Usage: `.rps <rock|paper|scissors> <bet>`");

    const userChoice = args[0].toLowerCase();
    if (!choices.includes(userChoice)) return reply("❌ Invalid choice!");

    let bet = parseInt(args[1]) || 100;
    let eco = getUserEco(sender);

    if (!validateBet(bet, eco, reply)) return;

    const botChoice = choices[Math.floor(Math.random() * 3)];
    let resultText = "";

    if (userChoice === botChoice) {
      resultText = "🤝 It's a tie! Bet returned.";
    } else if (
      (userChoice === "rock" && botChoice === "scissors") ||
      (userChoice === "paper" && botChoice === "rock") ||
      (userChoice === "scissors" && botChoice === "paper")
    ) {
      eco.wallet += bet;
      resultText = `🎉 You WIN ${bet} coins!`;
    } else {
      eco.wallet -= bet;
      resultText = `😢 You LOSE ${bet} coins.`;
    }

    updateUserEco(sender, eco);

    reply(`✊✋✌️ *RPS*\n\nYou: ${userChoice}\nBot: ${botChoice}\n\n${resultText}\n💵 Wallet: ${eco.wallet}`);
  }
);

// -------- Slots --------
cmd(
  {
    pattern: "slot",
    desc: "Spin the slot machine 🎰",
    category: "games",
    filename: __filename,
  },
  async (malvin, mek, m, { sender, args, reply }) => {

    let bet = parseInt(args[0]) || 200;
    let eco = getUserEco(sender);

    if (!validateBet(bet, eco, reply)) return;

    const symbols = ["🍒", "🍋", "🍉", "⭐", "💎"];

    let slot1 = symbols[Math.floor(Math.random() * symbols.length)];
    let slot2 = symbols[Math.floor(Math.random() * symbols.length)];
    let slot3 = symbols[Math.floor(Math.random() * symbols.length)];

    let resultText = `🎰 *SLOTS* 🎰\n[ ${slot1} | ${slot2} | ${slot3} ]\n\n`;

    if (slot1 === slot2 && slot2 === slot3) {
      eco.wallet += bet * 3;
      resultText += `🎉 *JACKPOT!* +${bet * 3} coins`;
    } else if (slot1 === slot2 || slot2 === slot3 || slot1 === slot3) {
      eco.wallet += bet;
      resultText += `✨ You got a pair! +${bet} coins`;
    } else {
      eco.wallet -= bet;
      resultText += `😢 You lost ${bet} coins.`;
    }

    updateUserEco(sender, eco);

    reply(resultText + `\n💵 Wallet: ${eco.wallet}`);
  }
);