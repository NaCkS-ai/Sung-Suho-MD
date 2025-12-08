// plugins/ping2.js
const { cmd } = require("../command");

cmd(
  {
    pattern: "ping2",
    desc: "Check bot latency (fancier style)",
    react: "📶",
    category: "utility",
    filename: __filename,
  },
  async (malvin, mek, m, { reply }) => {
    try {
      const start = Date.now();

      await malvin.sendMessage(
        mek.key.remoteJid,
        { text: "⏳ Running latency test..." },
        { quoted: mek }
      );

      const ping = Date.now() - start;

      // Latency Evaluation
      let status;
      if (ping <= 100) status = "🟢 Excellent";
      else if (ping <= 250) status = "🟡 Stable";
      else if (ping <= 500) status = "🟠 Slow";
      else status = "🔴 Critical";

      // Premium Discord-style Output
      const msg = `
╔══════════════════════════╗
   📶 SUHO MD V2 — LATENCY REPORT
╚══════════════════════════╝

⏱️ **Response Time:** ${ping} ms  
📡 **Connection Status:** ${status}

──────────────────────────────
System stable • Powered by Lord Sung
──────────────────────────────
`;

      await reply(msg);

    } catch (e) {
      console.error("Ping2 Command Error:", e);
      reply("❌ Error while checking latency!");
    }
  }
);