const { cmd } = require("../command");
const axios = require("axios");
const { Buffer } = require("buffer");

// format list
const FORMATS = {
  mp3: "MP3 (Audio Only)",
  144: "144p",
  240: "240p",
  360: "360p",
  480: "480p",
  720: "720p (HD)",
  1080: "1080p (Full HD)"
};

const API_URL = "https://host.optikl.ink/download/youtube";

// session storage (per chat)
const ytdlSession = {};

function formatDuration(seconds = 0) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return h > 0
    ? `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
    : `${m}:${String(s).padStart(2, "0")}`;
}

async function fetchVideoInfo(url, format) {
  const { data } = await axios.get(API_URL, {
    params: { url, format },
    timeout: 60000,
    headers: { "User-Agent": "Mozilla/5.0" }
  });

  if (!data?.status || data.code !== 200) {
    throw new Error(data?.message || "Failed to fetch video");
  }

  const r = data.result;
  return {
    title: r.title || "Unknown",
    duration: formatDuration(r.duration),
    thumbnail: r.thumbnail,
    quality: r.quality || format,
    downloadUrl: r.download,
    type: format === "mp3" ? "audio" : "video"
  };
}

/* ================= COMMAND ================= */

cmd(
  {
    pattern: "ytdl",
    desc: "Download YouTube audio/video",
    category: "download",
    react: "📥",
    filename: __filename
  },
  async (conn, mek, m, { from, text, reply }) => {
    if (!text)
      return reply(
        `Usage:\n.ytdl <youtube link>\n\nExample:\n.ytdl https://youtu.be/xxxx`
      );

    if (!/(youtube\.com|youtu\.be)/i.test(text))
      return reply("❌ Please provide a valid YouTube link");

    const list = Object.entries(FORMATS)
      .map(([k, v]) => `• ${k} → ${v}`)
      .join("\n");

    const sent = await reply(
      `📌 *Available Formats*\n\n${list}\n\nReply with the format (example: 360 or mp3)`
    );

    // save session
    ytdlSession[from] = {
      link: text,
      msgId: sent.key.id
    };
  }
);

/* ================= REPLY HANDLER ================= */

cmd(
  {
    on: "text"
  },
  async (conn, mek, m, { from }) => {
    const session = ytdlSession[from];
    if (!session) return;

    const replyId =
      m.message?.extendedTextMessage?.contextInfo?.stanzaId;
    if (replyId !== session.msgId) return;

    const format = m.text.toLowerCase();
    if (!FORMATS[format]) return;

    try {
      await conn.sendMessage(from, {
        react: { text: "⏳", key: m.key }
      });

      const info = await fetchVideoInfo(session.link, format);

      let thumb;
      if (info.thumbnail) {
        try {
          const res = await axios.get(info.thumbnail, {
            responseType: "arraybuffer",
            timeout: 10000
          });
          thumb = Buffer.from(res.data);
        } catch {}
      }

      const caption =
        `🎬 *Title:* ${info.title}\n` +
        `⏱ *Duration:* ${info.duration}\n` +
        `🎞 *Quality:* ${info.quality}`;

      if (info.type === "audio") {
        await conn.sendMessage(
          from,
          {
            audio: { url: info.downloadUrl },
            mimetype: "audio/mpeg",
            fileName: `${info.title}.mp3`,
            caption
          },
          { quoted: m }
        );
      } else {
        await conn.sendMessage(
          from,
          {
            video: { url: info.downloadUrl },
            mimetype: "video/mp4",
            caption,
            jpegThumbnail: thumb
          },
          { quoted: m }
        );
      }

    } catch (e) {
      await conn.sendMessage(from, { text: "❌ " + e.message }, { quoted: m });
    }

    delete ytdlSession[from];
  }
);
