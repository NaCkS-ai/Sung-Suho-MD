const { cmd } = require("../command");
const config = require("../config");

const OWNER_JID = "27649342626@s.whatsapp.net";

cmd(
  {
    pattern: "reportbug",
    desc: "Report a bug directly to the bot owner",
    category: "utility",
    react: "🐞",
    filename: __filename,
  },
  async (conn, mek, m, { from, args, pushname, sender, reply }) => {
    try {
      const reportText = args.join(" ").trim();

      if (!reportText) {
        return reply(
          "🐞 *Bug Report*\n\nUsage:\n.reportbug <describe the bug>\n\nExample:\n.reportbug menu crashes when I type 3"
        );
      }

      const reportMessage = `
🐞 *BUG REPORT RECEIVED*

👤 *From:* ${pushname || "Unknown"}
📱 *Number:* ${sender}

📝 *Report:*
${reportText}

⏰ *Time:* ${new Date().toLocaleString()}
`.trim();

      // Send report to owner
      await conn.sendMessage(OWNER_JID, {
        text: reportMessage,
      });

      // Confirm to user
      await reply(
        "✅ *Bug report sent successfully!*\n\nThank you for helping improve the bot 🛠️"
      );
    } catch (err) {
      console.error("ReportBug Error:", err);
      reply("❌ Failed to send bug report. Please try again later.");
    }
  }
);
