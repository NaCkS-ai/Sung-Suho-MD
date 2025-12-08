const { cmd } = require("../command");
const { ephoto } = require("../lib/ephoto");
 cmd(
  {
    pattern: "advancedglow",
    desc: "Generates logo in category of advancedglow",
    react: "💯",
    category: "Advancedglow",
    filename: __filename,
  },
 async (malvin, mek, m, { from, q, reply }) => {
    if (!q) {
      return reply(`*Example: ${prefix}advancedglow Kelvin and Sung*`);
    }

    const link = "https://en.ephoto360.com/advanced-glow-effects-74.html";

    try {
      let result = await ephoto(link, q);
      await malvin.sendMessage(
        m.chat,
        { image: { url: result }, caption: `${mess.success}` },
        { quoted: m }
      );
    } catch (error) {
      console.error("Error in advancedglow command:", error);
      reply("*An error occurred while generating the effect.*");
    }
},

  {
    pattern: "blackpinklogo",
    desc: "generates logo to blackpink",
    react: "🖤",
    category: "blackpinklogo",
    filename: __filename,
  },
 async (malvin, mek, m, { from, q, reply }) => {
    if (!q) {
      return reply(`*Example: ${prefix}blackpinklogo Kelvin and Dev sung*`);
    }

    const link = "https://en.ephoto360.com/create-blackpink-logo-online-free-607.html";

    try {
      let result = await ephoto(link, q);
      await malvin.sendMessage(
        m.chat,
        { image: { url: result }, caption: `${mess.success}` },
        { quoted: m }
      );
    } catch (error) {
      console.error("Error in blackpinklogo command:", error);
      reply("*An error occurred while generating the effect.*");
    }
},
  {
    pattern: "blackpinkstyle",
    desc: "generates logo in blackpinkstyle ",
    react: "✌️",
    category: "logo",
    filename: __filename,
  },
 async (malvin, mek, m, { from, q, reply }) => {
    if (!q) {
      return reply(`*Example: ${prefix}blackpinkstyle Kelvin and Sung*`);
    }

    const link = "https://en.ephoto360.com/online-blackpink-style-logo-maker-effect-711.html";

    try {
      let result = await ephoto(link, q);
      await malvin.sendMessage(
        m.chat,
        { image: { url: result }, caption: `${mess.success}` },
        { quoted: m }
      );
    } catch (error) {
      console.error("Error in blackpinkstyle command:", error);
      reply("*An error occurred while generating the effect.*");
    }
}, 
  {
    pattern: "cartoonstyle",
    desc: "generates logo in form of cartoon",
    react: "💢",
    category: "logomaker",
    filename: __filename,
  },
 async (malvin, mek, m, { from, q, reply }) => {
    if (!q) {
      return reply(`*Example: ${prefix}cartoonstyle Kelvin and Sung*`);
    }

    const link = "https://en.ephoto360.com/create-a-cartoon-style-graffiti-text-effect-online-668.html";

    try {
      let result = await ephoto(link, q);
      await malvin.sendMessage(
        m.chat,
        { image: { url: result }, caption: `${mess.success}` },
        { quoted: m }
      );
    } catch (error) {
      console.error("Error in cartoonstyle command:", error);
      reply("*An error occurred while generating the effect.*");
    }
},
  {
    pattern: "deletintext",
    desc: "generates logo to deletingtext ",
    react: "📄",
    category: "logo",
    filename: __filename,
  },
 async (malvin, mek, m, { from, q, reply }) => {
    if (!q) {
      return reply(`*Example: ${prefix}deletingtext Kelvin and Dev sung*`);
    }

    const link = "https://en.ephoto360.com/create-eraser-deleting-text-effect-online-717.html";

    try {
      let result = await ephoto(link, q);
      await malvin.sendMessage(
        m.chat,
        { image: { url: result }, caption: `${mess.success}` },
        { quoted: m }
      );
    } catch (error) {
      console.error("Error in deletingtext command:", error);
      reply("*An error occurred while generating the effect.*");
    }
},
  {
    pattern: "dragonball",
    desc: "generates logo to Dragonball",
    react: "🐉",
    category: "logo",
    filename: __filename,
  },
 async (malvin, mek, m, { from, q, reply }) => {
    if (!q) {
      return reply(`*Example: ${prefix}dragonball Kelvin and Sung*`);
    }

    const link = "https://en.ephoto360.com/create-dragon-ball-style-text-effects-online-809.html";

    try {
      let result = await ephoto(link, q);
      await malvin.sendMessage(
        m.chat,
        { image: { url: result }, caption: `${mess.success}` },
        { quoted: m }
      );
    } catch (error) {
      console.error("Error in dragonball command:", error);
      reply("*An error occurred while generating the effect.*");
    }
},
  {
    pattern: "effectclounds",
    desc: "generates logo to effectclounds",
    react: "☁️",
    category: "logo",
    filename: __filename,
  },
 async (malvin, mek, m, { from, q, reply }) => {
    if (!q) {
      return reply(`*Example: ${prefix}effectclouds Tylor*`);
    }

    const link = "https://en.ephoto360.com/write-text-effect-clouds-in-the-sky-online-619.html";

    try {
      let result = await ephoto(link, q);
      await malvin.sendMessage(
        m.chat,
        { image: { url: result }, caption: `${mess.success}` },
        { quoted: m }
      );
    } catch (error) {
      console.error("Error in effectclouds command:", error);
      reply("*An error occurred while generating the effect.*");
    }
},
  {
    pattern: "galaxywallpaper",
    desc: "generate logo to galaxywallpaper",
    react: "🌠",
    category: "logo",
    filename: __filename,
  },
 async (malvin, mek, m, { from, q, reply }) => {
    if (!q) {
      return reply(`*Example: ${prefix}galaxywallpaper Tylor*`);
    }

    const link = "https://en.ephoto360.com/create-galaxy-wallpaper-mobile-online-528.html";

    try {
      let result = await ephoto(link, q);
      await malvin.sendMessage(
        m.chat,
        { image: { url: result }, caption: `${mess.success}` },
        { quoted: m }
      );
    } catch (error) {
      console.error("Error in galaxywallpaper command:", error);
      reply("*An error occurred while generating the effect.*");
    }
  }
);

