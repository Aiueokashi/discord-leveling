const ms = require('parse-ms');
const Discord = require('discord.js');
const RDatabase = require('@replit/database');
const repdb = new RDatabase();
const leveling = require('discord-leveling');
const data = require('quick.db')

exports.run = async (client, message, args, config) => {
  let timeout = 86400000;
  let camount = 3000;
  let xamount = 100;
  let daily = await data.fetch(`daily_${message.author.id}`);
  repdb.get(`coin_${message.author.id}`).then(value => {
    if (!value) {
      message.channel.send('登録されていません\n登録コマンド:ps!login');
      return;
    } else {
      if (daily !== null && timeout - (Date.now() - daily) > 0) {
        let time = ms(timeout - (Date.now() - daily));

        message.channel.send(
          `**${time.hours}h ${time.minutes}m ${time.seconds}s**後に受け取れるよ`
        );
      } else {
        let embed = new Discord.MessageEmbed()
          .setAuthor(message.author.tag, message.author.displayAvatarURL)
          .setColor('RANDOM')
          .setDescription(`**🎉Daily Reward🎉**`)
          .addField(`coin💰:`, camount)
          .addField('xp🧪:', xamount);

        message.channel.send(embed);
        repdb.get(`coin_${message.author.id}`).then(value => {
          repdb.set(`coin_${message.author.id}`, value + camount).then(() => { });
        });
        leveling.AddXp(message.author.id, 100);
        data.set(`daily_${message.author.id}`, Date.now());
      }
    }
  });


};
