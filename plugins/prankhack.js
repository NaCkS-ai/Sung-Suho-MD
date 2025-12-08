// plugins/prankhack.js
const { cmd } = require("../command");

// Track active pranks per chat
const activePranks = new Set();

cmd(
  {
    pattern: "hack",
    alias: ["hackprank", "prank"],
    react: "💻",
    desc: "Harmless hacking prank (100% fake)",
    category: "fun",
    filename: __filename,
    fromMe: false,
  },

  async (malvin, mek, m, { from, reply }) => {
    try {
      // Prevent double-run
      if (activePranks.has(from)) {
        return reply("⚠️ A prank is already running in this chat.\nType *.stopprank* to cancel it.");
      }
      activePranks.add(from);

      // Detect target
      let target = "You";
      let targetJid = m.sender;

      if (m.quoted?.key?.participant) {
        targetJid = m.quoted.key.participant;
      } else if (m.mentionedJid?.length) {
        targetJid = m.mentionedJid[0];
      }

      if (typeof targetJid === "string") {
        target = targetJid.split("@")[0];
      }

      // Start
      await malvin.sendMessage(
        from,
        {
          text:
            `💻 *SUHO MD V2 – Fake Hack Module Initiated*\n` +
            `🎯 Target: *${target}*\n\n` +
            `⚠️ This is **100% fake**. Type *.stopprank* anytime.`,
        },
        { quoted: mek }
      );

      // Steps (smooth timing)
      const steps = [
        "Connecting to target system...",
        "Loading Suho-V2 exploit engine...",
        "Bypassing security firewalls (simulated)...",
        "Scanning directories...",
        "Extracting fake user data...",
        "Decrypting imaginary passwords...",
        "Uploading prank payload...",
        "Completing final steps..."
      ];

      for (const step of steps) {
        if (!activePranks.has(from)) return;
        await malvin.sendMessage(from, { text: `🔹 ${step}` }, { quoted: mek });
        await new Promise((r) => setTimeout(r, 900));
      }

      // Progress bar
      const progress = [10, 28, 45, 63, 80, 92, 100];

      for (const p of progress) {
        if (!activePranks.has(from)) return;
        let bar = "█".repeat(p / 10) + "░".repeat(10 - p / 10);

        await malvin.sendMessage(
          from,
          { text: `📊 Suho MD V2 Progress: [${bar}] ${p}%` },
          { quoted: mek }
        );

        await new Promise((r) => setTimeout(r, 550));
      }

      // Fake report
      if (activePranks.has(from)) {
        await malvin.sendMessage(
          from,
          {
            text:
              `📂 *SUHO MD V2 – Fake Scan Complete*\n\n` +
              `👤 Target: ${target}\n` +
              `📁 Files Found: memes.png, random.zip\n` +
              `🔐 Password Strength: Very Strong (fake)\n` +
              `🌐 IP Trace: 127.0.0.1 (localhost 😂)\n`,
          },
          { quoted: mek }
        );
      }

      // Final reveal
      if (activePranks.has(from)) {
        await malvin.sendMessage(
          from,
          {
            text:
              `🎭 *PRANK COMPLETED — SUHO MD V2 EDITION*\n\n` +
              `✔️ No data was accessed.\n` +
              `✔️ No hacking was performed.\n` +
              `✔️ Everything was simulated.\n\n` +
              `🔥 Powered by *Suho MD V2*`,
          },
          { quoted: mek }
        );
      }

      activePranks.delete(from);

    } catch (err) {
      console.error("PrankHack Error:", err);
      activePranks.delete(from);
      reply("❌ Error running prank: " + err.message);
    }
  }
);