const { cmd, commands } = require("../command");
const { Sticker, StickerTypes } = require("wa-sticker-formatter");
const { downloadMediaMessage } = require("../lib/msg.js"); // Adjust the path as needed

cmd(
  {
    pattern: "sticker",
    alias: ["s", "stick"],
    react: "🔖",
    desc: "Convert an image to a sticker",
    category: "utility",
    filename: __filename,
  },
  async (
    malvin,
    mek,
    m,
    {
      from,
      quoted,
      body,
      isCmd,
      command,
      args,
      q,
      isGroup,
      sender,
      senderNumber,
      botNumber2,
      botNumber,
      pushname,
      isMe,
      isOwner,
      groupMetadata,
      groupName,
      participants,
      groupAdmins,
      isBotAdmins,
      isAdmins,
      reply,
    }
  ) => {
    try {
      // Ensure the message contains an image or video to convert to a sticker
      if (!quoted || !(quoted.imageMessage || quoted.videoMessage)) {
        return reply(
          "Please reply to an image or video to convert it to a sticker."
        );
      }

      // Download the media from the quoted message
      const media = await downloadMediaMessage(quoted, "stickerInput");
      if (!media) return reply("Failed to download the media. Try again!");

      // Create the sticker from the media
      const sticker = new Sticker(media, {
        pack: "𝑵𝑶𝑽𝑨𝑪𝑶𝑹𝑬✟", // Sticker pack name
        author: "dev sung🪀", // Sticker author name
        type: StickerTypes.FULL, // Sticker type (FULL or CROPPED)
        quality: 50, // Quality of the output sticker (0–100)
      });

      const buffer = await sticker.toBuffer();
      await malvin.sendMessage(from, { sticker: buffer }, { quoted: mek });
    } catch (e) {
      console.error(e);
      reply(`Error: ${e.message || e}`);
    }
  }
);
