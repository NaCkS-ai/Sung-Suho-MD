// plugins/rank.js
const fs = require("fs");
const path = require("path");
const { cmd } = require("../command"); // your command handler
const rankFile = path.join(__dirname, "../lib/rank.json");

let rankDB = {};
if (fs.existsSync(rankFile)) {
  rankDB = JSON.parse(fs.readFileSync(rankFile));
}

function saveRank() {
  fs.writeFileSync(rankFile, JSON.stringify(rankDB, null, 2));
}

// Get or create user rank
function getUserRank(userId) {
  if (!rankDB[userId]) {
    rankDB[userId] = { xp: 0, level: 1 };
    saveRank();
  }
  return rankDB[userId];
}

// Add XP and handle level up
function addXP(userId, amount, reply) {
  let user = getUserRank(userId);
  user.xp += amount;
  let leveledUp = false;

  while (user.xp >= 200 * user.level) {
    user.xp -= 200 * user.level;
    user.level++;
    leveledUp = true;
  }

  saveRank();

  if (leveledUp && reply) {
    reply(`🎉 @${userId.split("@")[0]} leveled up to Level ${user.level}!`, { mentions: [userId] });
  }
}

// Display user rank
function displayRank(userId) {
  let user = getUserRank(userId);
  return `🎖 Level: ${user.level}\n💫 XP: ${user.xp}/${user.level*200}`;
}

// Get leaderboard
function getLeaderboard(limit = 10) {
  let users = Object.keys(rankDB).map(u => ({ user: u, level: rankDB[u].level, xp: rankDB[u].xp }));
  users.sort((a,b) => b.level - a.level || b.xp - a.xp);
  return users.slice(0, limit);
}

// ---------------- COMMANDS ---------------- //

// .rank command
cmd({
  pattern: "rank",
  desc: "Check your rank and XP",
  category: "rank",
  filename: __filename
}, async (malvin, mek, m, { sender, reply }) => {
  reply(displayRank(sender));
});

// .leaderboard command
cmd({
  pattern: "leaderboard",
  alias: ["top"],
  desc: "Show top ranked users",
  category: "rank",
  filename: __filename
}, async (malvin, mek, m, { reply }) => {
  let top = getLeaderboard(10);
  let list = "🏆 *Top 10 Users* 🏆\n\n";
  top.forEach((u,i) => {
    list += `${i+1}. @${u.user.split("@")[0]} - Level ${u.level} (${u.xp} XP)\n`;
  });
  reply(list, { mentions: top.map(u => u.user) });
});

module.exports = { addXP, getUserRank, displayRank, getLeaderboard };
