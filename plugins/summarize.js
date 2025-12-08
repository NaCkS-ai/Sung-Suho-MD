// plugins/summarize.js
const { cmd } = require("../command");
const axios = require("axios");

cmd(
  {
    pattern: "summarize",
    react: "📖",
    desc: "Summarize a long text into a short version",
    category: "ai",
    filename: __filename,
  },
  async (malvin, mek, m, { args, reply }) => {
    try {
      const text = args.join(" ");
      if (!text) return reply("⚡ Provide text to summarize.\nExample: `.summarize The quick brown fox jumps over the lazy dog...`");

      // Using a free summarization API (can be replaced with OpenAI / Deepseek API if you have key)
      const res = await axios.post("https://api.smrzr.io/v1/summarize?num_sentences=3", {
        text: text,
      });

      if (!res.data.summary) return reply("❌ Could not summarize the text.");

      const summary = `
⚡ *NOVACORE Summarizer* ⚡

📝 *Original Length:* ${text.split(" ").length} words
📖 *Summary:* ${res.data.summary}
      `.trim();

      await reply(summary);
    } catch (e) {
      console.error(e);
      reply("❌ Error while summarizing text.");
    }
  }
);
