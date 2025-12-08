// plugins/config.js
const { cmd } = require("../command");
const fs = require("fs");
const path = require("path");

const configPath = path.join(__dirname, "../config.json");

// Load config
function loadConfig() {
  if (!fs.existsSync(configPath)) {
    fs.writeFileSync(
      configPath,
      JSON.stringify(
        {
          botname: "SUHO-MD V2",
          prefix: ".",
          owner: "27649342626",
          status: "I am alive 🚀",
        },
        null,
        2
      )
    );
  }
  return JSON.parse(fs.readFileSync(configPath));
}

// Save config
function saveConfig(data) {
  fs.writeFileSync(configPath, JSON.stringify(data, null, 2));
}

// ------------------ Show Config ------------------
cmd(
  { pattern: "config", desc: "Show current bot config", category: "config", filename: __filename },
  async (sock, m, msg, { reply }) => {
    const config = loadConfig();
    reply(
      `⚙️ *Bot Config*\n\n🤖 Botname: ${config.botname}\n📌 Prefix: ${config.prefix}\n👑 Owner: ${config.owner}\n💬 Status: ${config.status}`
    );
  }
);

// ------------------ Set Prefix ------------------
cmd(
  { pattern: "setprefix", desc: "Change bot prefix", category: "config", filename: __filename },
  async (sock, m, msg, { args, reply }) => {
    if (!args.length) return reply("❌ Usage: .setprefix <newprefix>");
    const config = loadConfig();
    config.prefix = args[0];
    saveConfig(config);
    reply(`✅ Prefix updated to *${args[0]}*`);
  }
);

// ------------------ Set Botname ------------------
cmd(
  { pattern: "setbotname", desc: "Change bot name", category: "config", filename: __filename },
  async (sock, m, msg, { args, reply }) => {
    if (!args.length) return reply("❌ Usage: .setbotname <newname>");
    const config = loadConfig();
    config.botname = args.join(" ");
    saveConfig(config);
    reply(`✅ Bot name updated to *${config.botname}*`);
  }
);

// ------------------ Set Owner ------------------
cmd(
  { pattern: "setowner", desc: "Change owner number", category: "config", filename: __filename },
  async (sock, m, msg, { args, reply }) => {
    if (!args.length) return reply("❌ Usage: .setowner <number>");
    const config = loadConfig();
    config.owner = args[0];
    saveConfig(config);
    reply(`✅ Owner updated to *${config.owner}*`);
  }
);

// ------------------ Set Status ------------------
cmd(
  { pattern: "setstatus", desc: "Change bot status message", category: "config", filename: __filename },
  async (sock, m, msg, { args, reply }) => {
    if (!args.length) return reply("❌ Usage: .setstatus <text>");
    const config = loadConfig();
    config.status = args.join(" ");
    saveConfig(config);
    reply(`✅ Status updated to *${config.status}*`);
  }
);
