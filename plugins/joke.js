// plugins/joke.js
const { cmd } = require("../command");
const axios = require("axios");

cmd(
  {
    pattern: "joke",
    desc: "Get a random joke",
    react: "😂",
    category: "fun",
    filename: __filename,
  },
  async (malvin, mek, m, { reply }) => {
    try {
      const { data } = await axios.get("https://v2.jokeapi.dev/joke/Any?type=single");
      if (!data || !data.joke) return reply("❌ Couldn't fetch a joke!");
      reply(`😂 *Here's a joke for you:*\n\n${data.joke}`);
    } catch (e) {
      console.error("Joke Command Error:", e);
      reply("❌ Error fetching joke.");
    }
  }
);