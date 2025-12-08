const { cmd } = require("../command");
const { handleMediaUpload } = require('../lib/catbox');

cmd(
  {
    pattern: "tourl",
    desc: "Converts media to url",
    react: "💯",
    category: "url",
    filename: __filename,
  },
 async (malvin, mek, m, { from, q, reply }) => {
    const quoted = m.quoted || m.msg?.quoted;
    const mime = quoted?.mimetype || quoted?.msg?.mimetype;

    if (!quoted || !mime) {
      return reply('*Please reply to a media message!*');
    }

    try {
      const mediaUrl = await handleMediaUpload(quoted, malvin, mime);
      reply(`*Uploaded successfully:*\n${mediaUrl}`);
    } catch (error) {
      console.error(error);
      reply('*An error occurred while uploading the media.*');
    }
  }
);

