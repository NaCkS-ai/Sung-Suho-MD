// plugins/hangman.js
const { cmd } = require("../command");

const games = {}; // Store ongoing games per chat

cmd(
  {
    pattern: "hangman",
    react: "🪓",
    desc: "Play Hangman game",
    category: "games",
    filename: __filename,
  },
  async (malvin, mek, m, { from, reply, args }) => {
    try {
      // Start new game
      if (!args[0] || args[0].toLowerCase() === "start") {
        const words = ["javascript", "novacore", "discord", "whatsapp", "bot", "anime"];
        const word = words[Math.floor(Math.random() * words.length)].toLowerCase();

        games[from] = {
          word,
          guessed: [],
          attempts: 6,
        };

        return reply(
          `🪓 *Hangman Started!*\n\nWord: ${"_ ".repeat(word.length)}\nAttempts left: 6\n\nType "hangman <letter>" to guess a letter.`
        );
      }

      // Check if a game exists
      if (!games[from]) return reply("❌ No ongoing game. Start a new one using: hangman start");

      const game = games[from];
      const guess = args[0].toLowerCase();

      if (guess.length !== 1 || !/[a-z]/.test(guess)) {
        return reply("❌ Please guess a single letter (a-z).");
      }

      if (game.guessed.includes(guess)) return reply("❌ You already guessed that letter.");

      game.guessed.push(guess);

      if (!game.word.includes(guess)) {
        game.attempts--;
        if (game.attempts <= 0) {
          delete games[from];
          return reply(`💀 You lost! The word was: *${game.word}*`);
        }
      }

      // Display current word progress
      const display = game.word
        .split("")
        .map((l) => (game.guessed.includes(l) ? l : "_"))
        .join(" ");

      // Check if won
      if (!display.includes("_")) {
        delete games[from];
        return reply(`🎉 Congratulations! You guessed the word: *${game.word}*`);
      }

      reply(`🪓 Word: ${display}\nAttempts left: ${game.attempts}\nGuessed letters: ${game.guessed.join(", ")}`);
    } catch (e) {
      console.error(e);
      reply("❌ Something went wrong with Hangman.");
    }
  }
);