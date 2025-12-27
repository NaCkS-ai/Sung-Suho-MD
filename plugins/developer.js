const { cmd } = require("../command");

cmd({
  pattern: "developer",
  alias: ["dev", "creator"],
  desc: "Show bot developer information",
  category: "info",
  react: "👑",
  filename: __filename,
  fromMe: false,
}, async (malvin, mek, m, { reply }) => {

  const ownerName = "𝐋𝐎𝐑𝐃 𝐒𝐔𝐍𝐆";
  const ownerNumber = "27649342626";
  const github = "https://github.com/NaCkS-ai";
  const image = "https://files.catbox.moe/nho7jk.jpg"; // menu image

  const caption = `
╭━━━━━━━━━━━━━━━━━━━━━━━╮
┃ 👑 *DEVELOPER INFO*
╰━━━━━━━━━━━━━━━━━━━━━━━╯

• *Owner*   : ${ownerName}
• *Number*  : wa.me/${ownerNumber}
• *GitHub*  : ${github}

╭━━━━━━━━━━━━━━━━━━━━━━━╮
┃ 🤖 *BOTS / REPOS*
╰━━━━━━━━━━━━━━━━━━━━━━━╯

• SUHO-MD V2  
• SUHO-MD  
• Cyberia-MD 
• Anime WhatsApp Bots  
• Multi-Device Baileys Bots  

╭━━━━━━━━━━━━━━━━━━━━━━━╮
┃ ⚡ Powered by *SUHO-MD V2*
╰━━━━━━━━━━━━━━━━━━━━━━━╯
`.trim();

  await malvin.sendMessage(
    mek.key.remoteJid,
    {
      image: { url: image },
      caption
    },
    { quoted: mek }
  );
});
