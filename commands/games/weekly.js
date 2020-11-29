const ms = require('parse-ms')
const Discord = require('discord.js')
const data = require('quick.db')
const leveling = require('discord-leveling');
const RDatabase = require('@replit/database');
const repdb = new RDatabase();

exports.run = async (client, message, args, config) => {


  let timeout = 604800000
  let camount = 10000
  let xamount = 1000
    ;
  let weekly = await data.fetch(`weekly_${message.author.id}`);
  const RDatabase = require('@replit/database');
  const repdb = new RDatabase();
  repdb.get(`coin_${message.author.id}`).then(value => {
    if (!value) {
      return message.channel.send("登録されていません\n登録コマンド:ps!login")
    } else {
      if (weekly !== null && timeout - (Date.now() - weekly) > 0) {
        let time = ms(timeout - (Date.now() - weekly));

        message.channel.send(`**${time.days}d${time.hours}h ${time.minutes}m ${time.seconds}s**後に受け取れるよ`)
      } else {
        let embed = new Discord.MessageEmbed()
          .setAuthor(message.author.tag, message.author.displayAvatarURL)
          .setColor("RANDOM")
          .setDescription(`**🎊Weekly Reward🎊**`)
          .addField(`coin💰:`, camount)
          .addField("xp🧪:", xamount)

        message.channel.send(embed)
        leveling.AddXp(message.author.id, 1000);
        data.set(`weekly_${message.author.id}`, Date.now())
      }
    }
  })



}