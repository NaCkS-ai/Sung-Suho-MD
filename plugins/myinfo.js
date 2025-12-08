// plugins/myinfo.js
const { cmd } = require("../command");

cmd(
  {
    pattern: "myinfo",
    desc: "Show your user information",
    category: "main",
    filename: __filename,
    react: "👤",
  },
  async (malvin, mek, m, { from, sender, pushname, reply, isGroup, participants }) => {
    try {
      const userJid = sender;
      const userNumber = userJid.split("@")[0];
      const username = pushname || userNumber;

      // Default values
      let isAdmin = false;
      let groupName = "Private Chat";

      if (isGroup && participants) {
        const participant = participants.find(p => p.id === sender);
        isAdmin = participant?.admin ? true : false;
        groupName = m.chatMetadata?.subject || "Unknown Group";
      }

      const userInfo = `
┏━━━━━━━━━━━━━━━━━━━┓
┃     👤 *YOUR INFO*     
┗━━━━━━━━━━━━━━━━━━━┛

📛 Name    : ${username}
📱 Number  : +${userNumber}
🏷️ JID     : ${userJid}
💬 Chat    : ${isGroup ? "Group" : "Private"}

${isGroup ? `👥 Group   : ${groupName}\n🔑 Admin   : ${isAdmin ? "Yes" : "No"}` : ""}

━━━━━━━━━━━━━━━
⚡ Powered by 𝑵𝑶𝑽𝑨𝑪𝑶𝑹𝑬✟
━━━━━━━━━━━━━━━
`;

      await reply(userInfo);
    } catch (e) {
      console.error(e);
      reply("❌ Error fetching your info:\n" + e.message);
    }
  }
);
