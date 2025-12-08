// plugins/setbot.js
const { cmd } = require("../command");
const fs = require("fs");
const config = require("../config");

cmd(
  {
    pattern: "setbot",
    alias: ["setbotname", "setbotimg", "setowner"],
    desc: "Change bot name, image or owner info",
    category: "owner",
    react: "⚙️",
    filename: __filename,
    fromMe: true, // Only owner can run
  },
  async (malvin, mek, m, { from, args, reply, quoted }) => {
    try {
      if (!args[0]) return reply("❌ Usage: setbot <name|image|owner> <value>");

      const option = args[0].toLowerCase();
      const value = args.slice(1).join(" ");

      switch (option) {
        case "name":
          if (!value) return reply("❌ Please provide a new bot name.");
          config.BOT_NAME = value;
          fs.writeFileSync("./config.json", JSON.stringify(config, null, 2));
          reply(`✅ Bot name updated to *${value}*`);
          break;

        case "owner":
          if (!value) return reply("❌ Please provide new owner name/number.");
          config.OWNER_NUMBER = value;
          fs.writeFileSync("./config.json", JSON.stringify(config, null, 2));
          reply(`✅ Bot owner updated to *${value}*`);
          break;

        case "image":
          let imgUrl;
          if (quoted && quoted.image) {
            const buffer = await malvin.downloadMediaMessage(quoted);
            fs.writeFileSync("./botimage.jpg", buffer);
            imgUrl = "./botimage.jpg";
          } else if (value) {
            imgUrl = value; // URL provided
          } else {
            return reply("❌ Please provide image URL or reply to an image.");
          }
          config.BOT_IMAGE = imgUrl;
          fs.writeFileSync("./config.json", JSON.stringify(config, null, 2));
          reply("✅ Bot image updated successfully!");
          break;

        default:
          reply("❌ Invalid option. Use name, image or owner.");
      }
    } catch (e) {
      console.error("SetBot Error:", e);
      reply("❌ Failed to update bot settings.");
    }
  }
);