// plugins/reactions.js
const { cmd } = require("../command");
const axios = require("axios");

// Reaction list with URLs (replace with your preferred APIs or static GIFs)
const reactions = {
  hug: "https://some-api.com/api/hug",
  kiss: "https://some-api.com/api/kiss",
  pat: "https://some-api.com/api/pat",
  slap: "https://some-api.com/api/slap",
  poke: "https://some-api.com/api/poke",
  cuddle: "https://some-api.com/api/cuddle",
  cry: "https://some-api.com/api/cry",
  laugh: "https://some-api.com/api/laugh",
  wink: "https://some-api.com/api/wink",
  dance: "https://some-api.com/api/dance",
  highfive: "https://some-api.com/api/highfive",
};

Object.keys(reactions).forEach((action) => {
  cmd(
    {
      pattern: action,
      desc: `Send a ${action} reaction`,
      react: "🥰",
      category: "reaction",
      filename: __filename,
    },
    async (malvin, mek, m, { from, reply, args }) => {
      try {
        const target = args[0] || "someone"; // Optional: tag someone

        // Fetch GIF/Image
        let imageUrl = reactions[action];
        try {
          const res = await axios.get(reactions[action]);
          if (res.data.url) imageUrl = res.data.url;
        } catch {
          // fallback to static URL
        }

        await malvin.sendMessage(
          from,
          {
            image: { url: imageUrl },
            caption: `💞 *${m.pushName || "You"} ${action}s ${target}!*`,
          },
          { quoted: mek }
        );
      } catch (e) {
        console.error(`${action} command error:`, e);
        reply(`❌ Failed to send ${action} reaction.`);
      }
    }
  );
});