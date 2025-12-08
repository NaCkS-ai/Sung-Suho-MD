// plugins/list.js
const { cmd, commands } = require("../command");
const config = require("../config");

cmd(
  {
    pattern: "list",
    alias: ["commands", "allcmds"],
    react: "📖",
    desc: "Show all categories and commands",
    category: "main",
    filename: __filename,
  },
  async (malvin, mek, m, { from, reply }) => {
    try {
      // Prepare category storage
      let categorized = {};

      for (let i = 0; i < commands.length; i++) {
        const oneCmd = commands[i];
        if (oneCmd.pattern && !oneCmd.dontAddCommandList) {
          const category = oneCmd.category || "other";
          if (!categorized[category]) categorized[category] = [];
          categorized[category].push(oneCmd.pattern);
        }
      }

      // Build list text
      let listText = `📖 *SUHO-MD V2✟ COMMAND LIST* 📖\n\n`;

      for (let category in categorized) {
        listText += `╭─❖ ${category.toUpperCase()} ❖\n`;
        categorized[category].forEach((cmd) => {
          listText += `│ ➤ ${config.PREFIX}${cmd}\n`;
        });
        listText += `╰───────────────\n\n`;
      }

      listText += `⚡ Total Commands: *${commands.length}*  
Powered by *SUHO-MD V2✟*`;

      // Send the list
      await malvin.sendMessage(
        from,
        {
          text: listText,
        },
        { quoted: mek }
      );
    } catch (e) {
      console.error("List Command Error:", e);
      reply("❌ Error while generating command list.");
    }
  }
);
