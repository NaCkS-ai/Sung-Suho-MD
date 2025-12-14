const { cmd } = require("../command");
const config = require("../config");
const axios = require("axios");

// Suho MD V2 – Fake vCard Branding
const fakevCard = {
  key: {
    fromMe: false,
    participant: "0@s.whatsapp.net",
    remoteJid: "status@broadcast",
  },
  message: {
    contactMessage: {
      displayName: "© SUHO MD V2",
      vcard: `BEGIN:VCARD
VERSION:3.0
FN:Suho-MD V2
ORG:SUHO MD PROJECT;
TEL;type=CELL;type=VOICE;waid=00000000000:+00000000000
END:VCARD`,
    },
  },
};

cmd(
  {
    pattern: "repo",
    alias: ["source", "github"],
    react: "📦",
    desc: "Show Suho MD V2 GitHub repository info",
    category: "main",
    filename: __filename,
  },

  async (malvin, mek, m, { reply, from }) => {
    try {
      if (!config.REPO) {
        return reply("❌ GitHub repo link not set in config.js");
      }

      // Extract owner & repo name from URL
      // Example: https://github.com/USER/REPO
      const match = config.REPO.match(
        /github\.com\/([^/]+)\/([^/]+)/i
      );

      if (!match) {
        return reply("❌ Invalid GitHub repository URL.");
      }

      const [, owner, repo] = match;

      // Fetch repo data from GitHub API
      const { data } = await axios.get(
        `https://api.github.com/repos/${owner}/${repo}`,
        {
          headers: { "User-Agent": "SUHO-MD-V2" },
        }
      );

      const caption = `
╭━━━〔 🚀 *SUHO MD V2 — OFFICIAL REPO* 〕━━━╮

📦 *Repository*
${config.REPO}

⭐ *Stars:* ${data.stargazers_count}
🍴 *Forks:* ${data.forks_count}
👀 *Watchers:* ${data.watchers_count}

📝 *Description*
${data.description || "No description available."}

💖 Support the project by starring & forking!

╰━━━━━━━━━━━━━━━━━━━━━━━━━━╯
⚡ Powered by *SUHO MD V2*
`.trim();

      await malvin.sendMessage(
        from,
        {
          image: {
            url: "https://files.catbox.moe/3lv5zs.jpg",
          },
          caption,
        },
        { quoted: fakevCard }
      );
    } catch (e) {
      console.error("Repo Command Error:", e?.response?.data || e);
      reply("❌ Failed to fetch GitHub repository info.");
    }
  }
);
