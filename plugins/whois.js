// plugins/whois.js
const { cmd } = require("../command");

cmd(
  {
    pattern: "whois",
    alias: ["userinfo"],
    desc: "Get detailed info about a user",
    react: "👤",
    category: "utility",
    filename: __filename,
    fromMe: false,
  },
  async (malvin, mek, m, { from, reply }) => {
    try {
      const userJid = mek.mentionedJid && mek.mentionedJid[0] ? mek.mentionedJid[0] : m.sender;

      // Fetch profile picture
      let profilePic = "https://i.ibb.co/SDWZFh23/malvin-xd.jpg"; // fallback
      try {
        profilePic = await malvin.profilePictureUrl(userJid, "image");
      } catch {}

      // Fetch contact info
      const contact = await malvin.onWhatsApp(userJid);
      const userName = contact && contact[0]?.notify ? contact[0].notify : "Unknown";
      const isBot = contact && contact[0]?.isBusiness ? "Yes 🤖" : "No";

      // Fetch admin info if in a group
      let adminStatus = "N/A";
      try {
        const groupMetadata = await malvin.groupMetadata(from);
        const participant = groupMetadata.participants.find((p) => p.id === userJid);
        if (participant) {
          adminStatus =
            participant.admin === "admin" ? "Group Admin" :
            participant.admin === "superadmin" ? "Group Owner" :
            "Member";
        }
      } catch {}

      const msg = `
👤 *User Info*

• *Name:* ${userName}
• *JID:* ${userJid}
• *Number:* ${userJid.split("@")[0]}
• *Is Bot:* ${isBot}
• *Group Status:* ${adminStatus}
`;

      await malvin.sendMessage(
        from,
        { image: { url: profilePic }, caption: msg },
        { quoted: mek }
      );

    } catch (e) {
      console.error("❌ Whois Command Error:", e);
      reply("❌ Failed to fetch user info!");
    }
  }
);