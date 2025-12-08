// lib/uploader.js
/**
 * ✦ NovaCore Uploader ✦
 * Uploads media (images, videos) to an online host and returns the direct URL.
 * 
 * Primary: Telegraph
 * Fallback: Pomf.lain.la
 */

const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const path = require("path");
const { tmpdir } = require("os");
const { fromBuffer } = require("file-type");

/**
 * Upload buffer to telegraph or fallback
 * @param {Buffer} buffer
 * @returns {Promise<string>} direct URL
 */
async function uploader(buffer) {
  try {
    if (!Buffer.isBuffer(buffer)) throw new Error("Invalid buffer input");

    const fileType = await fromBuffer(buffer);
    if (!fileType) throw new Error("Cannot detect file type");

    const fileName = `novacore_${Date.now()}.${fileType.ext}`;
    const tempFilePath = path.join(tmpdir(), fileName);
    fs.writeFileSync(tempFilePath, buffer);

    // === Telegraph Upload ===
    const form = new FormData();
    form.append("file", fs.createReadStream(tempFilePath));

    const res = await axios.post("https://telegra.ph/upload", form, {
      headers: form.getHeaders(),
      maxBodyLength: Infinity,
    });

    fs.unlinkSync(tempFilePath); // cleanup temp file

    if (Array.isArray(res.data) && res.data[0]?.src) {
      return `https://telegra.ph${res.data[0].src}`;
    } else {
      throw new Error("Telegraph upload failed");
    }
  } catch (err) {
    console.warn("Telegraph upload failed:", err.message);

    // === Fallback: Pomf.lain.la ===
    try {
      const fallbackForm = new FormData();
      const fileType = await fromBuffer(buffer);
      const fileName = `novacore_${Date.now()}.${fileType?.ext || "jpg"}`;

      fallbackForm.append("files[]", buffer, fileName);

      const res2 = await axios.post("https://pomf.lain.la/upload.php", fallbackForm, {
        headers: fallbackForm.getHeaders(),
        maxBodyLength: Infinity,
      });

      const json = res2.data;
      if (json && json.files && json.files[0]?.url) {
        return json.files[0].url;
      } else {
        throw new Error("Fallback upload failed");
      }
    } catch (err2) {
      console.error("Fallback uploader failed:", err2.message);
      throw new Error("All uploaders failed");
    }
  }
}

module.exports = { uploader };
