// plugins/games2.js
const { cmd } = require("../command");
const fs = require("fs");
const path = require("path");

const ecoFile = path.join(__dirname, "../lib/economy.json");

// Economy DB Loader
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
  return ecoDB[userId];
}
function updateUserEco(userId, data) {
  ecoDB[userId] = data;
  saveEco();
}

// Helper: check bet
function checkBet(sender, reply, bet) {
  if (!bet || isNaN(bet) || bet <= 0) return reply("❌ Enter a valid bet amount!");
  let eco = getUserEco(sender);
  if (eco.wallet < bet) {
    reply("❌ Not enough coins!");
    return false;
  }
  return true;
}

// 1️⃣ Dice Duel
cmd({ pattern: "diceduel", desc: "Roll 2 dice vs bot", category: "casino", filename: __filename },
  async (malvin, mek, m, { sender, args, reply }) => {
    let bet = parseInt(args[0]) || 100;
    if (!checkBet(sender, reply, bet)) return;
    let eco = getUserEco(sender);

    let userRoll = Math.floor(Math.random() * 6) + 1;
    let botRoll = Math.floor(Math.random() * 6) + 1;

    if (userRoll > botRoll) {
      eco.wallet += bet;
      reply(`🎲 You rolled ${userRoll}, Bot rolled ${botRoll} → You WIN ${bet} coins!`);
    } else if (userRoll < botRoll) {
      eco.wallet -= bet;
      reply(`🎲 You rolled ${userRoll}, Bot rolled ${botRoll} → You LOSE ${bet} coins!`);
    } else {
      reply(`🎲 Both rolled ${userRoll} → It's a TIE!`);
    }
    updateUserEco(sender, eco);
  }
);

// 2️⃣ Coin Flip Extreme
cmd({ pattern: "coinx", desc: "Double or nothing coin flip", category: "casino", filename: __filename },
  async (malvin, mek, m, { sender, args, reply }) => {
    let bet = parseInt(args[0]) || 200;
    if (!checkBet(sender, reply, bet)) return;
    let eco = getUserEco(sender);

    let result = Math.random() < 0.5 ? "heads" : "tails";
    if (Math.random() < 0.5) {
      eco.wallet += bet * 2;
      reply(`🪙 Landed on ${result}! You WIN ${bet * 2} coins!`);
    } else {
      eco.wallet -= bet;
      reply(`🪙 Landed on ${result}! You LOSE ${bet} coins.`);
    }
    updateUserEco(sender, eco);
  }
);

// 3️⃣ Slots Pro
cmd({ pattern: "slotspro", desc: "Spin 5-slot machine", category: "casino", filename: __filename },
  async (malvin, mek, m, { sender, args, reply }) => {
    let bet = parseInt(args[0]) || 300;
    if (!checkBet(sender, reply, bet)) return;
    let eco = getUserEco(sender);

    const symbols = ["🍒","🍋","🍉","⭐","💎","7️⃣"];
    let rolls = Array.from({length:5}, () => symbols[Math.floor(Math.random()*symbols.length)]);

    let msg = `🎰 Slots Pro 🎰\n[ ${rolls.join(" | ")} ]\n\n`;

    if (rolls.every(s => s === rolls[0])) {
      eco.wallet += bet * 5;
      msg += `🎉 MEGA JACKPOT! Won ${bet * 5} coins!`;
    } else if (new Set(rolls).size <= 2) {
      eco.wallet += bet * 2;
      msg += `✨ 4 of a kind! Won ${bet * 2} coins!`;
    } else {
      eco.wallet -= bet;
      msg += `😢 Lost ${bet} coins.`;
    }

    updateUserEco(sender, eco);
    reply(msg);
  }
);

// 4️⃣ Blackjack (simple 21)
cmd({ pattern: "blackjack", desc: "Play blackjack vs bot", category: "casino", filename: __filename },
  async (malvin, mek, m, { sender, args, reply }) => {
    let bet = parseInt(args[0]) || 500;
    if (!checkBet(sender, reply, bet)) return;
    let eco = getUserEco(sender);

    let user = Math.floor(Math.random()*11)+15;
    let dealer = Math.floor(Math.random()*11)+15;

    let msg = `🃏 Blackjack 🃏\nYou: ${user} | Dealer: ${dealer}\n`;

    if ((user <= 21 && dealer > 21) || (user <= 21 && user > dealer)) {
      eco.wallet += bet;
      msg += `🎉 You WIN ${bet} coins!`;
    } else if (user === dealer) {
      msg += "😐 Push (Tie).";
    } else {
      eco.wallet -= bet;
      msg += `😢 You LOSE ${bet} coins.`;
    }

    updateUserEco(sender, eco);
    reply(msg);
  }
);

// 5️⃣ Roulette
cmd({ pattern: "roulette", desc: "Bet on red/black/green", category: "casino", filename: __filename },
  async (malvin, mek, m, { sender, args, reply }) => {
    if (!args[0]) return reply("Usage: .roulette <red|black|green> <bet>");
    let bet = parseInt(args[1]) || 200;
    if (!checkBet(sender, reply, bet)) return;
    let eco = getUserEco(sender);

    const spin = Math.floor(Math.random()*37); // 0-36
    const color = spin === 0 ? "green" : (spin % 2 === 0 ? "red" : "black");

    let msg = `🎯 Roulette: Ball landed on ${spin} (${color})\n`;
    if (args[0] === color) {
      let win = color === "green" ? bet * 14 : bet * 2;
      eco.wallet += win;
      msg += `🎉 You WIN ${win} coins!`;
    } else {
      eco.wallet -= bet;
      msg += `😢 You LOSE ${bet} coins.`;
    }

    updateUserEco(sender, eco);
    reply(msg);
  }
);

// 6️⃣ Craps (2 dice total)
cmd({ pattern: "craps", desc: "Bet on dice total 7 or 11", category: "casino", filename: __filename },
  async (malvin, mek, m, { sender, args, reply }) => {
    let bet = parseInt(args[0]) || 150;
    if (!checkBet(sender, reply, bet)) return;
    let eco = getUserEco(sender);

    let dice1 = Math.floor(Math.random()*6)+1;
    let dice2 = Math.floor(Math.random()*6)+1;
    let total = dice1 + dice2;

    let msg = `🎲 Craps: Rolled ${dice1}+${dice2} = ${total}\n`;
    if (total === 7 || total === 11) {
      eco.wallet += bet * 2;
      msg += `🎉 WIN! You get ${bet * 2} coins!`;
    } else {
      eco.wallet -= bet;
      msg += `😢 Lost ${bet} coins.`;
    }

    updateUserEco(sender, eco);
    reply(msg);
  }
);

// 7️⃣ Baccarat (lite)
cmd({ pattern: "baccarat", desc: "Bet on player or banker", category: "casino", filename: __filename },
  async (malvin, mek, m, { sender, args, reply }) => {
    if (!args[0]) return reply("Usage: .baccarat <player|banker> <bet>");
    let bet = parseInt(args[1]) || 250;
    if (!checkBet(sender, reply, bet)) return;
    let eco = getUserEco(sender);

    let player = Math.floor(Math.random()*9)+1;
    let banker = Math.floor(Math.random()*9)+1;

    let msg = `🎴 Baccarat: Player=${player}, Banker=${banker}\n`;
    let winner = player > banker ? "player" : (banker > player ? "banker" : "tie");

    if (args[0] === winner) {
      eco.wallet += bet * 2;
      msg += `🎉 You WIN ${bet*2} coins!`;
    } else {
      eco.wallet -= bet;
      msg += `😢 You LOSE ${bet} coins.`;
    }

    updateUserEco(sender, eco);
    reply(msg);
  }
);

// 8️⃣ Hi-Lo
cmd({ pattern: "hilo", desc: "Guess if next card is higher/lower", category: "casino", filename: __filename },
  async (malvin, mek, m, { sender, args, reply }) => {
    if (!args[0]) return reply("Usage: .hilo <high|low> <bet>");
    let bet = parseInt(args[1]) || 200;
    if (!checkBet(sender, reply, bet)) return;
    let eco = getUserEco(sender);

    let card1 = Math.floor(Math.random()*13)+1;
    let card2 = Math.floor(Math.random()*13)+1;

    let guess = args[0].toLowerCase();
    let msg = `💎 Hi-Lo: First=${card1}, Second=${card2}\n`;

    if ((guess === "high" && card2 > card1) || (guess === "low" && card2 < card1)) {
      eco.wallet += bet;
      msg += `🎉 Correct! You win ${bet} coins.`;
    } else {
      eco.wallet -= bet;
      msg += `😢 Wrong! You lose ${bet} coins.`;
    }

    updateUserEco(sender, eco);
    reply(msg);
  }
);

// 9️⃣ Number Guess
cmd({ pattern: "numguess", desc: "Guess number 1-10", category: "casino", filename: __filename },
  async (malvin, mek, m, { sender, args, reply }) => {
    let bet = parseInt(args[1]) || 100;
    if (!checkBet(sender, reply, bet)) return;
    let eco = getUserEco(sender);

    let guess = parseInt(args[0]);
    if (!guess || guess < 1 || guess > 10) return reply("Choose a number between 1-10!");

    let secret = Math.floor(Math.random()*10)+1;
    let msg = `🔢 Secret number was ${secret}\n`;

    if (guess === secret) {
      eco.wallet += bet * 5;
      msg += `🎉 Spot on! You win ${bet*5} coins!`;
    } else {
      eco.wallet -= bet;
      msg += `😢 Wrong guess! You lose ${bet} coins.`;
    }

    updateUserEco(sender, eco);
    reply(msg);
  }
);

// 🔟 Jackpot Spin
cmd({ pattern: "jackpot", desc: "Spin jackpot wheel", category: "casino", filename: __filename },
  async (malvin, mek, m, { sender, args, reply }) => {
    let bet = parseInt(args[0]) || 500;
    if (!checkBet(sender, reply, bet)) return;
    let eco = getUserEco(sender);

    const prizes = [0, bet*2, bet*5, bet*10, bet*20, -bet];
    let prize = prizes[Math.floor(Math.random()*prizes.length)];

    if (prize > 0) {
      eco.wallet += prize;
      reply(`🏆 Jackpot Wheel → You WON ${prize} coins!`);
    } else {
      eco.wallet += prize;
      reply(`🏆 Jackpot Wheel → You LOST ${Math.abs(prize)} coins.`);
    }

    updateUserEco(sender, eco);
  }
);
