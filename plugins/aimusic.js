const { cmd } = require("../command");
const axios = require("axios");

const delay = (ms) => new Promise(res => setTimeout(res, ms));

async function aimusic(prompt, { tags = "pop, romantic" } = {}) {
  if (!prompt) throw new Error("Prompt is required");

  // Step 1: Generate lyrics
  const { data: lyricApiRes } = await axios.get(
    "https://8pe3nv3qha.execute-api.us-east-1.amazonaws.com/default/llm_chat",
    {
      params: {
        query: JSON.stringify([
          {
            role: "system",
            content:
              "You are a professional lyricist AI trained to write poetic and rhythmic song lyrics. Respond with lyrics only, using [verse], [chorus], [bridge], and [instrumental] or [inst] tags. Do not add explanations or titles."
          },
          { role: "user", content: prompt }
        ]),
        link: "writecream.com"
      },
      headers: {
        "User-Agent": "Mozilla/5.0",
        Referer: "https://writecream.com/"
      }
    }
  );

  const lyrics = lyricApiRes?.response_content;
  if (!lyrics) throw new Error("Failed to generate lyrics");

  // Step 2: Send to music generator
  const session_hash = Math.random().toString(36).slice(2);

  await axios.post(
    "https://ace-step-ace-step.hf.space/gradio_api/queue/join",
    {
      data: [
        240,
        tags,
        lyrics,
        60,
        15,
        "euler",
        "apg",
        10,
        "",
        0.5,
        0,
        3,
        true,
        false,
        true,
        "",
        0,
        0,
        false,
        0.5,
        null,
        "none"
      ],
      fn_index: 11,
      session_hash
    }
  );

  // Step 3: Poll result
  let musicUrl;
  let tries = 0;

  while (!musicUrl && tries < 120) {
    const { data } = await axios.get(
      `https://ace-step-ace-step.hf.space/gradio_api/queue/data?session_hash=${session_hash}`
    );

    for (const block of data.split("\n\n")) {
      if (block.startsWith("data:")) {
        const parsed = JSON.parse(block.slice(5));
        if (parsed.msg === "process_completed") {
          musicUrl = parsed.output?.data?.[0]?.url;
          break;
        }
      }
    }

    tries++;
    await delay(1000);
  }

  if (!musicUrl) throw new Error("AI music generation timed out");

  return musicUrl;
}

cmd(
  {
    pattern: "aimusic",
    alias: ["generatemusic", "tomusic"],
    react: "🎵",
    desc: "Generate AI music from a text prompt",
    category: "ai",
    filename: __filename,
    premium: true
  },

  async (malvin, mek, m, { from, args, reply }) => {
    const text = args.join(" ").trim();

    if (!text) {
      return reply(
        `🎵 *AI Music Generator*\n\n` +
        `Usage:\n` +
        `• .aimusic <prompt>\n` +
        `• .aimusic <prompt> | <tags>\n\n` +
        `Example:\n.aimusic love song about summer | pop, happy`
      );
    }

    const [prompt, tagText] = text.split("|").map(v => v.trim());
    const tags = tagText || "pop, romantic";

    try {
      await reply("⏳ Creating AI music, please wait...");

      const musicUrl = await aimusic(prompt, { tags });

      await malvin.sendMessage(from, {
        audio: { url: musicUrl },
        mimetype: "audio/mpeg",
        fileName: `aimusic_${Date.now()}.mp3`,
        caption:
          `🎶 *AI Music Generated*\n\n` +
          `📝 Prompt: ${prompt}\n` +
          `🏷 Tags: ${tags}\n\n` +
          `Powered by *SUHO MD V2*`
      });

    } catch (err) {
      console.error("AI Music Error:", err);
      reply(`❌ Failed to generate AI music:\n${err.message}`);
    }
  }
);
