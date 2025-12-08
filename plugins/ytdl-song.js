const config = require('../config');
const { cmd } = require('../command');
const DY_SCRAP = require('@dark-yasiya/scrap');
const dy_scrap = new DY_SCRAP();

function replaceYouTubeID(url) {
    const regex = /(?:youtube\.com\/(?:.*v=|.*\/)|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

cmd({
    pattern: "song",
    alias: ["s","p"],
    react: "🎵",
    desc: "Download YouTube Audio",
    category: "download",
    use: ".song <Text or YT URL>",
    filename: __filename
}, async (conn, m, mek, { from, q, reply }) => {
    try {
        if (!q) return await reply("❌ Please provide a search query or YouTube URL!");

        let id = q.startsWith("https://") ? replaceYouTubeID(q) : null;

        if (!id) {
            const searchResults = await dy_scrap.ytsearch(q);
            if (!searchResults?.results?.length) return await reply("❌ No results found!");
            id = searchResults.results[0].videoId;
        }

        const data = await dy_scrap.ytsearch(`https://youtube.com/watch?v=${id}`);
        if (!data?.results?.length) return await reply("❌ Failed to fetch video details!");

        const { url, title, image, timestamp, ago, views, author } = data.results[0];

        const info = `🌸 *NOVACORE+ SONG DOWNLOADER* 🌸\n\n` +
            `🎵 *Title:* ${title || "Unknown"}\n` +
            `⏳ *Duration:* ${timestamp || "Unknown"}\n` +
            `👀 *Views:* ${views || "Unknown"}\n` +
            `🌏 *Published:* ${ago || "Unknown"}\n` +
            `👤 *Author:* ${author?.name || "Unknown"}\n` +
            `🔗 *Link:* ${url || "Unknown"}\n\n` +
            `🔽 *Reply with your choice:*\n` +
            `> 1️⃣ Audio 🎵\n` +
            `> 2️⃣ Document 📁\n\n` +
            `${config.FOOTER || "Powered by NOVACORE+"}`;

        const sentMsg = await conn.sendMessage(from, { image: { url: image }, caption: info }, { quoted: mek });
        await conn.sendMessage(from, { react: { text: '🎶', key: sentMsg.key } });

        const messageID = sentMsg.key.id;

        // Listen for user reply once
        conn.ev.on('messages.upsert', async (messageUpdate) => {
            try {
                const mekInfo = messageUpdate?.messages[0];
                if (!mekInfo?.message) return;

                const msgText = mekInfo?.message?.conversation || mekInfo?.message?.extendedTextMessage?.text;
                const isReplyToSentMsg = mekInfo?.message?.extendedTextMessage?.contextInfo?.stanzaId === messageID;

                if (!isReplyToSentMsg) return;

                const userReply = msgText.trim();
                let mediaType, processingMsg;

                if (userReply === "1") {
                    processingMsg = await conn.sendMessage(from, { text: "⏳ Preparing audio..." }, { quoted: mek });
                    const response = await dy_scrap.ytmp3(`https://youtube.com/watch?v=${id}`);
                    if (!response?.result?.download?.url) return await reply("❌ Download URL not found!");
                    mediaType = { audio: { url: response.result.download.url }, mimetype: "audio/mpeg" };

                } else if (userReply === "2") {
                    processingMsg = await conn.sendMessage(from, { text: "⏳ Preparing document..." }, { quoted: mek });
                    const response = await dy_scrap.ytmp3(`https://youtube.com/watch?v=${id}`);
                    if (!response?.result?.download?.url) return await reply("❌ Download URL not found!");
                    mediaType = { document: { url: response.result.download.url, fileName: `${title}.mp3`, mimetype: "audio/mpeg", caption: title } };

                } else {
                    return await reply("❌ Invalid choice! Reply with 1️⃣ or 2️⃣.");
                }

                await conn.sendMessage(from, mediaType, { quoted: mek });
                await conn.sendMessage(from, { text: '✅ Download Successful ✅', edit: processingMsg.key });

            } catch (error) {
                console.error(error);
                await reply(`❌ Error while processing: ${error.message || "Unknown error"}`);
            }
        });

    } catch (error) {
        console.error(error);
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
        await reply(`❌ Something went wrong: ${error.message || "Unknown error"}`);
    }
});
