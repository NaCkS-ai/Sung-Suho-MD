const fs = require('fs');
const config = require('../config');
const { cmd, commands } = require('../command');

cmd({
    pattern: "menu",
    desc: "Show interactive menu system",
    category: "menu",
    react: "🧾",
    filename: __filename
}, async (conn, mek, m, { from }) => {
    try {
        const totalCommands = Object.keys(commands).length;

        const menuCaption = `
╭━━━━━━━━━━━━━━━━━━━━━╮
┃ 🤖 *SUHO-MD V2 MENU*
╰━━━━━━━━━━━━━━━━━━━━━╯
👑 *Owner*    : 𝙇𝙊𝙍𝘿 𝙎𝙐𝙉𝙂
⚙️ *Prefix*   : ${config.PREFIX}
📦 *Mode*     : ${config.MODE}
🧠 *Commands* : ${totalCommands}
🚀 *Version*  : V2 Stable

╭━━━━━━━━━━━━━━━━━━━━━╮
┃ 📂 *MENU LIST*
┃ ① Download
┃ ② Group
┃ ③ Fun
┃ ④ Owner
┃ ⑤ AI
┃ ⑥ Anime
┃ ⑦ Convert
┃ ⑧ Other
┃ ⑨ Reactions
┃ ⑩ Main
┃ ⑪ Economy
╰━━━━━━━━━━━━━━━━━━━━━╯

📌 *Reply with a number (1–11)*
⚡ Powered by *SUHO-MD V2*
`.trim();

        const contextInfo = {
            mentionedJid: [m.sender],
            forwardingScore: 999,
            isForwarded: true
        };

        const sentMsg = await conn.sendMessage(
            from,
            {
                image: { url: "https://files.catbox.moe/nho7jk.jpg" },
                caption: menuCaption,
                contextInfo
            },
            { quoted: mek }
        );

        const messageID = sentMsg.key.id;

        const menuData = {
            '1': `📥 *DOWNLOAD MENU*
━━━━━━━━━━━━━━
• fb [url]
• tiktok [url]
• insta [url]
• ytmp3 [url]
• ytmp4 [url]
• song [name]`,

            '2': `👥 *GROUP MENU*
━━━━━━━━━━━━━━
• promote @user
• demote @user
• add @user
• remove @user
• tagall
• hidetag`,

            '3': `🎉 *FUN MENU*
━━━━━━━━━━━━━━
• joke
• rate @user
• ship @u1 @u2
• hack @user
• pickup`,

            '4': `👑 *OWNER MENU*
━━━━━━━━━━━━━━
• block @user
• unblock @user
• restart
• shutdown
• updatecmd`,

            '5': `🤖 *AI MENU*
━━━━━━━━━━━━━━
• ai [text]
• gpt [text]
• imagine [prompt]
• aimusic [prompt]`,

            '6': `🌸 *ANIME MENU*
━━━━━━━━━━━━━━
• waifu
• neko
• animegirl
• foxgirl
• loli`,

            '7': `🎨 *CONVERT MENU*
━━━━━━━━━━━━━━
• sticker [img]
• emojimix 😎+😂
• tomp3 [video]
• fancy [text]`,

            '8': `🧩 *OTHER MENU*
━━━━━━━━━━━━━━
• timenow
• date
• weather [city]
• fact
• movie [name]`,

            '9': `💫 *REACTIONS MENU*
━━━━━━━━━━━━━━
• hug @user
• kiss @user
• slap @user
• pat @user
• poke @user`,

            '10': `⚙️ *MAIN MENU*
━━━━━━━━━━━━━━
• ping
• alive
• uptime
• owner
• repo`,

            '11': `💰 *ECONOMY MENU*
━━━━━━━━━━━━━━
• balance
• wallet
• deposit
• withdraw
• daily
• weekly
• rob @user
• richlist`
        };

        const handler = async (msgData) => {
            try {
                const receivedMsg = msgData.messages[0];
                if (!receivedMsg?.message) return;

                const isReply =
                    receivedMsg.message.extendedTextMessage?.contextInfo?.stanzaId === messageID;
                if (!isReply) return;

                const userInput =
                    receivedMsg.message.conversation ||
                    receivedMsg.message.extendedTextMessage?.text;

                const selected = menuData[userInput];
                if (!selected) {
                    return conn.sendMessage(
                        from,
                        { text: "❌ Invalid option. Reply with *1–11*." },
                        { quoted: receivedMsg }
                    );
                }

                await conn.sendMessage(
                    from,
                    {
                        image: { url: "https://files.catbox.moe/nho7jk.jpg" },
                        caption: selected,
                        contextInfo
                    },
                    { quoted: receivedMsg }
                );
            } catch (e) {
                console.log("Menu handler error:", e);
            }
        };

        conn.ev.on("messages.upsert", handler);
        setTimeout(() => conn.ev.off("messages.upsert", handler), 300000);

    } catch (e) {
        console.error("Menu Error:", e);
    }
});
