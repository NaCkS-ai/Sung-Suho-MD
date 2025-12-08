const { cmd } = require("../command");
const fs = require("fs");
const path = require("path");

const ecoFile = path.join(__dirname, "../lib/economy.json");
if (!fs.existsSync(ecoFile)) fs.writeFileSync(ecoFile, "{}");
let ecoDB = JSON.parse(fs.readFileSync(ecoFile));

// Economy helpers
function getUserEco(userId) {
  if (!ecoDB[userId]) {
    ecoDB[userId] = { wallet: 500, bank: 0, inventory: [], lastDaily: null, cooldowns: {} };
    saveEco();
  }
  return ecoDB[userId];
}

function updateUserEco(userId, newData) {
  ecoDB[userId] = newData;
  saveEco();
}

function saveEco() {
  fs.writeFileSync(ecoFile, JSON.stringify(ecoDB, null, 2));
}

// VIP check
function checkVIP(sender) {
  const user = getUserEco(sender);
  return user.wallet + user.bank >= 10000;
}

// ------------------ VIP MENU ------------------
cmd(
  {
    pattern: "vip",
    desc: "Access VIP games (10k+ coins required)",
    category: "vip",
    filename: __filename,
  },
  async (conn, m, _, { sender, reply }) => {
    if (!checkVIP(sender)) return reply(`❌ You need at least 10,000 coins to access VIP games!`);
    const botImage = { url: "https://files.catbox.moe/przy2f.png" };
    const vipMenu = `
✨ *VIP Casino Menu* ✨
Welcome @${sender.split("@")[0]}!

🎲 .vipdice       - Roll dice for coins
🎰 .vipslot       - Spin the slot machine
🪙 .vipcoinflip  - Flip a coin and bet coins
🔢 .vipguess     - Guess a number 1-10
🎯 .viptarget    - Hit a random target
🃏 .vipblackjack - Play blackjack
🎡 .vipwheel     - Spin a lucky wheel
💰 .vipjackpot   - Try jackpot
🎟️ .vipraffle   - Enter VIP raffle
🎴 .vippoker     - Play poker
`;

    await conn.sendMessage(m.key.remoteJid, { image: botImage, caption: vipMenu, mentions: [sender] });
  }
);

// ------------------ VIP DICE ------------------
cmd(
  { pattern: "vipdice", desc: "Roll dice", category: "vip", filename: __filename },
  async (conn, m, _, { sender, reply }) => {
    if (!checkVIP(sender)) return reply("❌ Only VIP users.");
    const user = getUserEco(sender);
    const roll = Math.floor(Math.random() * 6) + 1;
    const coins = roll * 100;
    user.wallet += coins;
    updateUserEco(sender, user);
    reply(`🎲 Rolled *${roll}*! You won ${coins} coins. 💵 Wallet: ${user.wallet}`);
  }
);

// ------------------ VIP SLOT MACHINE ------------------
cmd(
  { pattern: "vipslot", desc: "Slot machine", category: "vip", filename: __filename },
  async (conn, m, _, { sender, reply }) => {
    if (!checkVIP(sender)) return reply("❌ Only VIP users.");
    const user = getUserEco(sender);
    const symbols = ["🍒","🍋","🍉","🍇","⭐"];
    const slot = [
      symbols[Math.floor(Math.random() * symbols.length)],
      symbols[Math.floor(Math.random() * symbols.length)],
      symbols[Math.floor(Math.random() * symbols.length)]
    ];
    let coinsWon = 0;
    if (slot[0]===slot[1] && slot[1]===slot[2]) coinsWon = 2000;
    else if (slot[0]===slot[1] || slot[1]===slot[2] || slot[0]===slot[2]) coinsWon = 500;
    user.wallet += coinsWon;
    updateUserEco(sender, user);
    reply(`🎰 | ${slot.join(" | ")} |\nWon: ${coinsWon} coins 💵 Wallet: ${user.wallet}`);
  }
);

// ------------------ VIP COIN FLIP ------------------
cmd(
  { pattern: "vipcoinflip", desc: "Coin flip", category: "vip", filename: __filename },
  async (conn, m, _, { sender, args, reply }) => {
    if (!checkVIP(sender)) return reply("❌ Only VIP users.");
    const user = getUserEco(sender);
    if (!args[0] || !args[1]) return reply("Usage: .vipcoinflip <heads/tails> <amount>");
    const choice = args[0].toLowerCase();
    const bet = parseInt(args[1]);
    if (user.wallet < bet) return reply("❌ Not enough coins!");
    const flip = Math.random() < 0.5 ? "heads" : "tails";
    if (flip === choice) {
      user.wallet += bet;
      reply(`🪙 It's *${flip}*! You won ${bet} coins 💵 Wallet: ${user.wallet}`);
    } else {
      user.wallet -= bet;
      reply(`🪙 It's *${flip}*! You lost ${bet} coins 💵 Wallet: ${user.wallet}`);
    }
    updateUserEco(sender, user);
  }
);

// ------------------ VIP NUMBER GUESS ------------------
cmd(
  { pattern: "vipguess", desc: "Guess number", category: "vip", filename: __filename },
  async (conn, m, _, { sender, args, reply }) => {
    if (!checkVIP(sender)) return reply("❌ Only VIP users.");
    const user = getUserEco(sender);
    if (!args[0] || !args[1]) return reply("Usage: .vipguess <1-10> <amount>");
    const guess = parseInt(args[0]);
    const bet = parseInt(args[1]);
    if (guess<1||guess>10) return reply("❌ Number must be 1-10!");
    if (user.wallet<bet) return reply("❌ Not enough coins!");
    const number = Math.floor(Math.random()*10)+1;
    if (guess===number) { user.wallet+=bet*5; reply(`🎯 Correct! Number was ${number}. Won ${bet*5} coins 💵 Wallet: ${user.wallet}`); }
    else { user.wallet-=bet; reply(`❌ Wrong! Number was ${number}. Lost ${bet} coins 💵 Wallet: ${user.wallet}`); }
    updateUserEco(sender,user);
  }
);

// ------------------ VIP TARGET ------------------
cmd(
  { pattern: "viptarget", desc: "Hit a target", category: "vip", filename: __filename },
  async (conn, m, _, { sender, reply }) => {
    if (!checkVIP(sender)) return reply("❌ Only VIP users.");
    const user=getUserEco(sender);
    const targets=["🎯 Bullseye","🎯 Near Hit","🎯 Miss"];
    const choice=targets[Math.floor(Math.random()*targets.length)];
    let coinsWon=0;
    if(choice==="🎯 Bullseye") coinsWon=2000;
    else if(choice==="🎯 Near Hit") coinsWon=1000;
    user.wallet+=coinsWon;
    updateUserEco(sender,user);
    reply(`🎯 Result: ${choice}\nCoins won: ${coinsWon} 💵 Wallet: ${user.wallet}`);
  }
);

// ------------------ VIP BLACKJACK ------------------
cmd(
  { pattern: "vipblackjack", desc: "Play blackjack", category: "vip", filename: __filename },
  async (conn,m,_,{sender,reply})=>{
    if(!checkVIP(sender)) return reply("❌ Only VIP users.");
    const user=getUserEco(sender);
    let bet=500;
    if(user.wallet<bet) return reply("❌ Not enough coins!");
    const cards=["A","2","3","4","5","6","7","8","9","10","J","Q","K"];
    const player=[cards[Math.floor(Math.random()*cards.length)],cards[Math.floor(Math.random()*cards.length)]];
    const dealer=[cards[Math.floor(Math.random()*cards.length)],cards[Math.floor(Math.random()*cards.length)]];
    const result=Math.random()<0.5?"won":"lost";
    if(result==="won"){user.wallet+=bet; reply(`🃏 Blackjack! You won ${bet} coins 💵 Wallet: ${user.wallet}`);}
    else{user.wallet-=bet; reply(`🃏 Dealer wins! You lost ${bet} coins 💵 Wallet: ${user.wallet}`);}
    updateUserEco(sender,user);
  }
);

// ------------------ VIP WHEEL ------------------
cmd(
  { pattern: "vipwheel", desc: "Spin lucky wheel", category: "vip", filename: __filename },
  async (conn,m,_,{sender,reply})=>{
    if(!checkVIP(sender)) return reply("❌ Only VIP users.");
    const user=getUserEco(sender);
    const prizes=[100,500,1000,2000,5000,0];
    const prize=prizes[Math.floor(Math.random()*prizes.length)];
    user.wallet+=prize;
    updateUserEco(sender,user);
    reply(`🎡 You spun the wheel! Won: ${prize} coins 💵 Wallet: ${user.wallet}`);
  }
);

// ------------------ VIP JACKPOT ------------------
cmd(
  { pattern: "vipjackpot", desc: "Try VIP jackpot", category: "vip", filename: __filename },
  async (conn,m,_,{sender,reply})=>{
    if(!checkVIP(sender)) return reply("❌ Only VIP users.");
    const user=getUserEco(sender);
    const bet=1000;
    if(user.wallet<bet) return reply("❌ Not enough coins!");
    const jackpot=Math.random()<0.1;
    if(jackpot){user.wallet+=10000; reply(`💎 JACKPOT! You won 10,000 coins 💵 Wallet: ${user.wallet}`);}
    else{user.wallet-=bet; reply(`❌ Jackpot failed! Lost 1000 coins 💵 Wallet: ${user.wallet}`);}
    updateUserEco(sender,user);
  }
);

// ------------------ VIP RAFFLE ------------------
cmd(
  { pattern: "vipraffle", desc: "Enter VIP raffle", category: "vip", filename: __filename },
  async (conn,m,_,{sender,reply})=>{
    if(!checkVIP(sender)) return reply("❌ Only VIP users.");
    const user=getUserEco(sender);
    const bet=500;
    if(user.wallet<bet) return reply("❌ Not enough coins!");
    user.wallet-=bet;
    const won=Math.random()<0.2;
    if(won){user.wallet+=5000; reply(`🎟️ You won the raffle! +5000 coins 💵 Wallet: ${user.wallet}`);}
    else{reply(`🎟️ Sorry, no win this time. Lost 500 coins 💵 Wallet: ${user.wallet}`);}
    updateUserEco(sender,user);
  }
);

// ------------------ VIP POKER ------------------
cmd(
  { pattern: "vippoker", desc: "Play VIP poker", category: "vip", filename: __filename },
  async (conn,m,_,{sender,reply})=>{
    if(!checkVIP(sender)) return reply("❌ Only VIP users.");
    const user=getUserEco(sender);
    const bet=1000;
    if(user.wallet<bet) return reply("❌ Not enough coins!");
    const result=Math.random()<0.5?"won":"lost";
    if(result==="won"){user.wallet+=bet*2; reply(`🃏 Poker! You won ${bet*2} coins 💵 Wallet: ${user.wallet}`);}
    else{user.wallet-=bet; reply(`🃏 Poker! You lost ${bet} coins 💵 Wallet: ${user.wallet}`);}
    updateUserEco(sender,user);
  }
);
