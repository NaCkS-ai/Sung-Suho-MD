// plugins/secretmenu.js
const { cmd } = require("../command");
const config = require("../config");

// 🔑 Set your secret key here
const SECRET_KEY = "darkshadow123"; // change this to anything you want

cmd(
  {
    pattern: "secretmenu",
    desc: "Access hidden secret menu",
    category: "hidden",
    filename: __filename,
  },
  async (malvin, mek, m, { args, reply, sender }) => {
    // Require password
    if (!args[0]) {
      return reply("🔑 Enter the secret key to unlock.\nUsage: `.secretmenu <key>`");
    }

    let key = args[0].trim();
    if (key !== SECRET_KEY && sender !== config.owner) {
      return reply("🚫 Access Denied! Wrong key.");
    }

    // ✅ If correct key or owner → show secret menu
    reply(
`🌌 *Secret Menu Unlocked* 🌌

🔮 Hidden Commands:
> .godmode — Unlimited coins
> .shadowban <@user> — Secret ban (invisible to others)
> .reveal — See hidden stats
> .vipupgrade <@user> — Make someone VIP
> .darkgift — Claim ultra reward

⚠️ Keep this menu secret!`
    );
  }
);
