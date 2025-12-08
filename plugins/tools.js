const { cmd } = require("../command");
const axios = require("axios");
const math = require("mathjs");

//
// TOOL COMMANDS MASTER FILE
// Category: Tools
//

function toolCommand(name, desc, func) {
  cmd(
    {
      pattern: name,
      desc,
      category: "tools",
      filename: __filename,
    },
    func
  );
}

// ------------------- TOOL COMMANDS ------------------- //

// 1) Ping
toolCommand("ping", "Check bot response time", async (conn, mek, m, { reply }) => {
  const start = Date.now();
  await reply("🏓 Pinging...");
  const end = Date.now();
  await reply(`✅ Pong! Response: *${end - start}ms*`);
});

// 2) Calculator
toolCommand("calc", "Perform basic calculations", async (conn, mek, m, { args, reply }) => {
  if (!args[0]) return reply("⚠️ Please provide a calculation.");
  try {
    const result = math.evaluate(args.join(" "));
    reply(`🧮 Result: *${result}*`);
  } catch (error) {
    reply("❌ Invalid calculation!");
  }
});

// 3) URL Shortener
toolCommand("short", "Shorten a URL", async (conn, mek, m, { args, reply }) => {
  if (!args[0]) return reply("🔗 Please provide a URL to shorten.");
  try {
    const response = await axios.get(`https://tinyurl.com/api-create.php?url=${args[0]}`);
    reply(`✨ Shortened URL: ${response.data}`);
  } catch (error) {
    reply("❌ Failed to shorten URL.");
  }
});

// 4) QR Code Generator
toolCommand("qr", "Generate a QR Code", async (conn, mek, m, { args, reply }) => {
  if (!args[0]) return reply("⚠️ Please provide text to generate a QR code.");
  reply(`🖼️ QR Code: https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(args.join(" "))}`);
});

// 5) Translate (Mock Implementation)
toolCommand("tr", "Translate text to English", async (conn, mek, m, { args, reply }) => {
  if (!args[0]) return reply("✍️ Please provide text to translate.");
  reply(`🌍 Translation (mock): "${args.join(" ")}" -> "English Text"`);
});

// 6) Weather (Mock Implementation)
toolCommand("weather", "Get weather information", async (conn, mek, m, { args, reply }) => {
  if (!args[0]) return reply("🌦️ Please provide a city.");
  reply(`☁️ Weather for ${args.join(" ")} (mock data)`);
});

// 7) Dictionary (Mock Implementation)
toolCommand("dict", "Get word meaning", async (conn, mek, m, { args, reply }) => {
  if (!args[0]) return reply("📘 Please provide a word.");
  reply(`📖 Definition of "${args[0]}" (mock)`);
});

// ------------------- SHORTCUT TOOLS ------------------- //
const shortcuts = [
  "currency", "iplookup", "base64", "unbase64", "screenshot",
  "fact", "joke", "meme", "tts", "ocr",
  "pdfmerge", "pdfsplit", "pdftotext", "img2pdf", "pdf2img",
  "password", "uuid", "ascii", "morse", "unmorse",
  "binary", "unbinary", "hex", "unhex", "reverse",
  "randomnum", "roll", "flip", "quote", "advice",
  "cat", "dog", "fox", "anime", "waifu",
  "reminder", "note", "timer", "stopwatch", "alarm",
  "songsearch", "lyrics", "movie", "tv", "news",
];

for (let s of shortcuts) {
  toolCommand(s, `Shortcut for ${s}`, async (conn, mek, m, { args, reply }) => {
    reply(`⚙️ Tool "${s}" executed with args: ${args.join(" ") || "none"}`);
  });
                                                      }
