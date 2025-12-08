// plugins/iplookup.js
const { cmd } = require("../command");
const axios = require("axios");
const dns = require("dns").promises;

cmd(
  {
    pattern: "iplookup",
    react: "🌍",
    desc: "Lookup information about an IP or Domain",
    category: "tools",
    filename: __filename,
  },
  async (malvin, mek, m, { args, reply }) => {
    try {
      if (!args[0]) {
        return reply("❌ Please provide an IP or domain.\n\nExample:\n.iplookup 8.8.8.8\n.iplookup google.com");
      }

      let target = args[0];
      let ip = target;

      // If input is not an IP, try resolving domain to IP
      if (!/^\d{1,3}(\.\d{1,3}){3}$/.test(target)) {
        try {
          const res = await dns.lookup(target);
          ip = res.address;
        } catch {
          return reply("❌ Could not resolve domain to IP.");
        }
      }

      // Fetch details from ip-api
      const { data } = await axios.get(`http://ip-api.com/json/${ip}`);

      if (data.status !== "success") return reply("❌ Could not fetch details. Try again later.");

      const info = `
🌍 *IP/Domain Lookup Results*

📌 *Query:* ${target}
💻 *Resolved IP:* ${data.query}
🏙️ *City:* ${data.city}
🌐 *Region:* ${data.regionName}
🌎 *Country:* ${data.country}
📡 *ISP:* ${data.isp}
🔑 *Org:* ${data.org}
⏰ *Timezone:* ${data.timezone}
📍 *Coordinates:* ${data.lat}, ${data.lon}

⚡ Powered by 𝑵𝑶𝑽𝑨𝑪𝑶𝑹𝑬✟
      `.trim();

      await reply(info);
    } catch (e) {
      console.error("IP Lookup Error:", e);
      reply("❌ Error while looking up: " + e.message);
    }
  }
);
