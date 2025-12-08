// plugins/convert.js
const { cmd } = require("../command");
const fs = require("fs");
const path = require("path");
const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("ffmpeg-static");

ffmpeg.setFfmpegPath(ffmpegPath);

// helper to convert with ffmpeg
async function convertWithFfmpeg(input, output, format) {
  return new Promise((resolve, reject) => {
    ffmpeg(input)
      .toFormat(format)
      .on("end", () => resolve(output))
      .on("error", (err) => reject(err))
      .save(output);
  });
}

// ------------------ Sticker ------------------
cmd(
  { pattern: "sticker", alias: ["s","st"], desc: "Convert image/video to sticker", category: "convert", filename: __filename },
  async (sock, m, msg, { reply }) => {
    try {
      if (!(m.type === "imageMessage" || m.type === "videoMessage")) {
        return reply("❌ Send/Reply to an image or short video with .sticker");
      }
      const media = await sock.downloadMediaMessage(m);
      await sock.sendMessage(m.chat, { sticker: media }, { quoted: m });
    } catch (e) {
      reply("⚠️ Failed to make sticker: " + e.message);
    }
  }
);

// ------------------ ToImg ------------------
cmd(
  { pattern: "toimg", desc: "Convert sticker to image", category: "convert", filename: __filename },
  async (sock, m, msg, { reply }) => {
    try {
      if (m.type !== "stickerMessage") return reply("❌ Reply to a sticker with .toimg");
      const media = await sock.downloadMediaMessage(m);
      await sock.sendMessage(m.chat, { image: media, caption: "Here is your image!" }, { quoted: m });
    } catch (e) {
      reply("⚠️ Failed to convert sticker: " + e.message);
    }
  }
);

// ------------------ ToMP3 ------------------
cmd(
  { pattern: "tomp3", desc: "Convert video/voice to mp3", category: "convert", filename: __filename },
  async (sock, m, msg, { reply }) => {
    try {
      if (!(m.type === "videoMessage" || m.type === "audioMessage")) {
        return reply("❌ Reply to a video/voice note with .tomp3");
      }
      const filePath = path.join(__dirname, "../tmp/input.mp4");
      const outputPath = path.join(__dirname, "../tmp/output.mp3");

      const media = await sock.downloadMediaMessage(m);
      fs.writeFileSync(filePath, media);

      await convertWithFfmpeg(filePath, outputPath, "mp3");

      const mp3 = fs.readFileSync(outputPath);
      await sock.sendMessage(m.chat, { audio: mp3, mimetype: "audio/mpeg" }, { quoted: m });

      fs.unlinkSync(filePath);
      fs.unlinkSync(outputPath);
    } catch (e) {
      reply("⚠️ Failed to convert: " + e.message);
    }
  }
);

// ------------------ ToVideo ------------------
cmd(
  { pattern: "tovideo", desc: "Convert animated sticker to video", category: "convert", filename: __filename },
  async (sock, m, msg, { reply }) => {
    try {
      if (m.type !== "stickerMessage") return reply("❌ Reply to an animated sticker with .tovideo");
      const media = await sock.downloadMediaMessage(m);
      await sock.sendMessage(m.chat, { video: media, caption: "Here is your video!" }, { quoted: m });
    } catch (e) {
      reply("⚠️ Failed to convert sticker to video: " + e.message);
    }
  }
);

// ------------------ ToGIF ------------------
cmd(
  { pattern: "togif", desc: "Convert animated sticker to gif", category: "convert", filename: __filename },
  async (sock, m, msg, { reply }) => {
    try {
      if (m.type !== "stickerMessage") return reply("❌ Reply to an animated sticker with .togif");
      const media = await sock.downloadMediaMessage(m);
      await sock.sendMessage(m.chat, { video: media, gifPlayback: true, caption: "Here is your GIF!" }, { quoted: m });
    } catch (e) {
      reply("⚠️ Failed to convert sticker to gif: " + e.message);
    }
  }
);

// ------------------ ToAudio ------------------
cmd(
  { pattern: "toaudio", desc: "Convert video to audio", category: "convert", filename: __filename },
  async (sock, m, msg, { reply }) => {
    try {
      if (m.type !== "videoMessage") return reply("❌ Reply to a video with .toaudio");

      const filePath = path.join(__dirname, "../tmp/input.mp4");
      const outputPath = path.join(__dirname, "../tmp/output.m4a");

      const media = await sock.downloadMediaMessage(m);
      fs.writeFileSync(filePath, media);

      await convertWithFfmpeg(filePath, outputPath, "m4a");

      const audio = fs.readFileSync(outputPath);
      await sock.sendMessage(m.chat, { audio: audio, mimetype: "audio/mp4" }, { quoted: m });

      fs.unlinkSync(filePath);
      fs.unlinkSync(outputPath);
    } catch (e) {
      reply("⚠️ Failed to convert video to audio: " + e.message);
    }
  }
);
