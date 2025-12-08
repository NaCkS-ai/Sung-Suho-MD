// plugins/developer.js
const { cmd } = require("../command");

cmd(
  {
    pattern: "developer",
    alias: ["dev", "creator"],
    desc: "Show developer info with image and intro text",
    category: "info",
    react: "👨‍💻",
    filename: __filename,
    fromMe: false,
  },
  async (malvin, mek, m, { reply }) => {
    const developerInfo = {
      name: "dev sung",
      number: "wa.me/263714757857",
      github: "https://github.com/NaCkS-ai",
      note: "බොට් එක ගැන support එකක් ඕන නම් msg එකක් දාන්න!",
      image:
        "https://files.catbox.moe/27ovis.jpg",
    };

    // STEP 1: Intro reaction (optional)
    await malvin.sendMessage(mek.key.remoteJid, {
      react: { text: "👨‍💻", key: mek.key },
    });

    // STEP 2: Intro Message
    await malvin.sendMessage(
      mek.key.remoteJid,
      { text: "👋 *HEY I AM THE DEVELOPER!*" },
      { quoted: mek }
    );

    // STEP 3: Developer Info with Image
    const caption = `
✟━━━━━━━━━━━━━━━━━━━━✟
      👨‍💻  *Developer Info*
✟━━━━━━━━━━━━━━━━━━━━✟

👤  *Name:* ${developerInfo.name}  
📞  *Contact:* ${developerInfo.number}  
💻  *GitHub:* ${developerInfo.github}  
📝  *Note:* ${developerInfo.note}  

✟━━━━━━━━━━━━━━━━━━━━✟
        ⚡ 𝑵𝑶𝑽𝑨𝑪𝑶𝑹𝑬 ✟
✟━━━━━━━━━━━━━━━━━━━━✟
`.trim();

    await malvin.sendMessage(
      mek.key.remoteJid,
      { image: { url: developerInfo.image }, caption },
      { quoted: mek }
    );
  }
);
