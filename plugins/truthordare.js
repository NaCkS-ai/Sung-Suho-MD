// plugins/truthordare.js
const { cmd } = require("../command");
const axios = require("axios");

cmd(
  {
    pattern: "tod",
    alias: ["truthordare"],
    desc: "Get a random Truth or Dare",
    react: "🎲",
    category: "fun",
    filename: __filename,
  },
  async (malvin, mek, m, { reply, args }) => {
    try {
      if (!args[0] || !["truth", "dare"].includes(args[0].toLowerCase())) {
        return reply("❌ Please type either `truth` or `dare`.\nExample: `.tod truth` or `.tod dare`");
      }

      const type = args[0].toLowerCase();
      const url = `https://api.truthordarebot.xyz/v1/${type}`;
      const { data } = await axios.get(url);

      if (!data || !data.question) return reply("❌ Could not fetch a question.");
      reply(`🎲 *${type.toUpperCase()} Question:*\n\n${data.question}`);
    } catch (e) {
      console.error("TruthOrDare Command Error:", e);
      reply("❌ Error fetching Truth or Dare.");
    }
  }
);