// plugins/anime.js
const { cmd } = require("../command");
const { Buffer } = require("buffer");
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));

const styles = {
  anime: "L7p91uXhVyp5OOJthAyqjSqhlbM+RPZ8+h2Uq9tz6Y+4Agarugz8f4JjxjEycxEzuj/7+6Q0YY9jUvrfmqkucAl/+qryNmYNVy6ndccs12kKvEph2JWqGX7Y3E6K1TIOuuZU7DlC3+XXHt7v6H58zbZqcWX9gRl1eMwWSUMaGTXA63S/FmmHZbzAuWw0EMOiUTD61YPwrfkXMaTGbj/ANYrjQmJ+oEF7rgQawjLCWb+TtSokamC48KVGqY1gXzWhZz3D5YYvD3QRjYmfHTNJpMp62FnhG7bXUuABGRU0h7tOeNua+qtL/l9k8xl54FkNTrOvbeHr0CX3pagD4uAYLB77CcGNjdIXK9otrH59BVNDzUMILDOFxK6ivAuNDX19zvZfDgKMI0/rxkojyuladw==",
  ghibli: "L7p91uXhVyp5OOJthAyqjSqhlbM+RPZ8+h2Uq9tz6Y+4Agarugz8f4JjxjEycxEzuj/7+6Q0YY9jUvrfmqkucAl/+qryNmYNVy6ndccs12kKvEph2JWqGX7Y3E6K1TIOuuZU7DlC3+XXHt7v6H58zbZqcWX9gRl1eMwWSUMaGTXA63S/FmmHZbzAuWw0EMOiUTD61YPwrfkXMaTGbj/ANa2W+vXedrRNL69qOO2kAyinFACvCnI92dPkhiZYuUz4ziNGVWmjQyZ/1WLtfZqIpDNmdsa6fHRRti5Qh1ehMJPltGo+Cr5HMM2GijVWWBw9mJk0GK7lAYjgJ3WhU9Uf+3G6h60IkRFiP3fwNlT9WdBkyWoU1EjDwAWscxTzxP5C4eifIPbvXx7s5W53crT6bA==",
  manga: "L7p91uXhVyp5OOJthAyqjSqhlbM+RPZ8+h2Uq9tz6Y+4Agarugz8f4JjxjEycxEzuj/7+6Q0YY9jUvrfmqkucAl/+qryNmYNVy6ndccs12kKvEph2JWqGX7Y3E6K1TIOuuZU7DlC3+XXHt7v6H58zbZqcWX9gRl1eMwWSUMaGTXA63S/FmmHZbzAuWw0EMOiUTD61YPwrfkXMaTGbj/ANcncfLQOC0nsvWPnYab5J9WXOEbry/uxd7mq+nl8cpWYgGX8eRd9UBT2amxq0VmV/mq3TGfs2OVny5D9fJyE8uftCyOLiy3S69WoF5Q6kty1wQB0DUCmXSCxNf6XYFOo1edHJsrANqlxYQvlE7fcuqrWO+nlApVUi1w1FqBHgqvtbb8tQ+ZuOS4O5tKHrUikfQ==",
  blocky: "L7p91uXhVyp5OOJthAyqjSqhlbM+RPZ8+h2Uq9tz6Y+4Agarugz8f4JjxjEycxEzuj/7+6Q0YY9jUvrfmqkucAl/+qryNmYNVy6ndccs12kKvEph2JWqGX7Y3E6K1TIOuuZU7DlC3+XXHt7v6H58zbZqcWX9gRl1eMwWSUMaGTXA63S/FmmHZbzAuWw0EMOiUTD61YPwrfkXMaTGbj/ANQynlUeOWEWPXtFZQVm9ze9eD7JHWgYB776oVwnnAjnMDc09YdnTHYCIJ/FNQJ1XD1EbtN7fT973qmsZAyQbvgi0jrYvY8pb0TL9Ucb0uvVZIJAxKXmTu0yNoj5xsk/yaByPlAByqirQDS93FPt3lNfBn0nn/5DJBnauU5SSllZK1BuAiOtK5y4eWjNLBT2+F9rK5fo1oJC7AkRAX+htTWcMQuY0cXPfYARQLYUOcHwbF0o7Y1lKnsgBVHaUGmx+/A==",
  "chinese-ink": "L7p91uXhVyp5OOJthAyqjSqhlbM+RPZ8+h2Uq9tz6Y+4Agarugz8f4JjxjEycxEzuj/7+6Q0YY9jUvrfmqkucAl/+qryNmYNVy6ndccs12kKvEph2JWqGX7Y3E6K1TIOuuZU7DlC3+XXHt7v6H58zbZqcWX9gRl1eMwWSUMaGTXA63S/FmmHZbzAuWw0EMOiUTD61YPwrfkXMaTGbj/ANXAqlula6QmFJcyeXkezRm5uL3o454Pdx8v3iItk7T83LUa1ugFreuO63Nplxo0aomKBlV04vrw+1zs807J/XoavvfxpwGGwnXEDUG83DucSCIv7hOuulu4EtbHm7k2M8RgNqQ+Cdxhy9v+Ibm3gvJrm+LW9/9ObYos9DQF5xWe7vdG6KPa+0HtHuKGb+CdhJg==",
  minimalist: "L7p91uXhVyp5OOJthAyqjSqhlbM+RPZ8+h2Uq9tz6Y+4Agarugz8f4JjxjEycxEzuj/7+6Q0YY9jUvrfmqkucAl/+qryNmYNVy6ndccs12kKvEph2JWqGX7Y3E6K1TIOuuZU7DlC3+XXHt7v6H58zbZqcWX9gRl1eMwWSUMaGTXA63S/FmmHZbzAuWw0EMOiUTD61YPwrfkXMaTGbj/ANcdrJgI4S8aZwd9To23kckE6cZoDRmU28+npLXJ5HnmXRGfcTgAo9+HkGFlzwwluaCxBhymjjk5EsWfkqNxSupctTt95IFHNrEYbq6jkcbv8AQK279uQXFHzVq55lEEcudKrAz22eRbXI16I2V9LO9L3tFwb6XWyxmGgc/EChlygzgXT7bfAp7vdEX0GFPgNuoKFEDdE9Y1vswXs8UG49IdaghvcPHGCBv5xwdVeD4r0nsqBfOjsv/Dl6CfR+o4cehAgJOfD/IDYvg8cemD56Ns="
};

const styleMap = {
  anime1: "anime",
  anime2: "ghibli",
  anime3: "manga",
  anime4: "blocky",
  anime5: "chinese-ink",
  anime6: "minimalist"
};

cmd({
  pattern: "anime",
  desc: "Anime image converter",
  category: "maker",
  react: "🎨",
  filename: __filename
}, async (conn, mek, m, { command, reply }) => {
  try {
    if (command === "anime") {
      return reply(
        `🎨 *Anime Converter Styles*

• anime1 – Anime  
• anime2 – Ghibli  
• anime3 – Manga  
• anime4 – Blocky  
• anime5 – Chinese Ink  
• anime6 – Minimalist  

📌 *Reply to an image with a style command*`
      );
    }

    const q = m.quoted || m;
    const mime = q.mimetype || "";

    if (!mime.startsWith("image/")) {
      return reply("🖼️ *Reply to an image first!*");
    }

    await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });

    const buffer = await q.download();
    const base64 = Buffer.from(buffer).toString("base64");
    const style = styleMap[command];

    const res = await fetch("https://aienhancer.ai/api/v1/r/image-enhance/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0"
      },
      body: JSON.stringify({
        model: 5,
        image: `data:image/jpeg;base64,${base64}`,
        settings: styles[style]
      })
    });

    const json = await res.json();
    const taskId = json?.data?.id;
    if (!taskId) return reply("❌ Failed to create task.");

    let output;
    while (!output) {
      await new Promise(r => setTimeout(r, 3000));
      const check = await fetch("https://aienhancer.ai/api/v1/r/image-enhance/result", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task_id: taskId })
      });
      const result = await check.json();
      if (result?.data?.status === "succeeded") output = result.data.output;
    }

    await conn.sendMessage(m.chat, { image: { url: output } }, { quoted: m });

  } catch (e) {
    reply("❌ Anime converter error.");
    console.error(e);
  }
});
