const { cmd } = require("../command");

cmd(
  {
    pattern: "vv",
    alias: ["viewonce", "retrive"],
    react: "🐳",
    desc: "Owner Only - retrieve quoted message back to user",
    category: "owner",
    filename: __filename,
    fromMe: true
  },
  async (client, mek, m, { from, isCreator }) => {
    try {
      if (!isCreator) {
        return await client.sendMessage(
          from,
          { text: "*📛 This is an owner command.*" },
          { quoted: mek }
        );
      }

      if (!m.quoted) {
        return await client.sendMessage(
          from,
          { text: "*🍁 Please reply to a view once message!*" },
          { quoted: mek }
        );
      }

      const buffer = await m.quoted.download();
      const mtype = m.quoted.mtype;
      const options = { quoted: mek };

      let messageContent = {};
      switch (mtype) {
        case "imageMessage":
          messageContent = {
            image: buffer,
            caption: m.quoted.text || "",
            mimetype: m.quoted.mimetype || "image/jpeg"
          };
          break;

        case "videoMessage":
          messageContent = {
            video: buffer,
            caption: m.quoted.text || "",
            mimetype: m.quoted.mimetype || "video/mp4"
          };
          break;

        case "audioMessage":
          messageContent = {
            audio: buffer,
            mimetype: "audio/mp4",
            ptt: m.quoted.ptt || false
          };
          break;

        default:
          return await client.sendMessage(
            from,
            { text: "❌ Only image, video, and audio messages are supported" },
            { quoted: mek }
          );
      }

      await client.sendMessage(from, messageContent, options);

    } catch (error) {
      console.error("vv Error:", error);
      await client.sendMessage(
        from,
        { text: "❌ Error fetching vv message:\n" + error.message },
        { quoted: mek }
      );
    }
  }
);
