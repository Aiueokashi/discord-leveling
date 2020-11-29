  exports.run = (client, message, args, userid) => {
    console.log("playing")

    const Discord = require("discord.js");

    let currency = client.getCredits.get(message.author.id);
    if(!currency){
      message.channel.send("登録されていません\n登録コマンド:ps!login")
      return;
    }
    const Database = require("better-sqlite3");
    const db = new Database('./user_data/currency.sqlite');
  
  let user = message.mentions.users.first() || client.users.cache.get(args[0]) || message.author;

  let level = client.db.get(`level_${user.id}`) || 0;
  let exp = client.db.get(`xp_${user.id}`) || 0;
  let neededXP = Math.floor(Math.pow(level / 0.1, 2));

  let every = client.db.all().filter(i => i.ID.startsWith("xp_")).sort((a, b) => b.data - a.data);
  let rank = every.map(x => x.ID).indexOf(`xp_${user.id}`) + 1;
  }