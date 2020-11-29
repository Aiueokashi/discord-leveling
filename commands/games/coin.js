const buff = require('../testbuffer.js');
const { MessageEmbed } = require("discord.js")
exports.run = (client, message, args) => {

    console.log(message.author.id)

    const RDatabase = require('@replit/database');
    const repdb = new RDatabase();
    repdb.get(`coin_${message.author.id}`).then(value=>
    {if(!value){
      message.channel.send("登録されていません\n登録コマンド:ps!login")
      return;
    }})
if(args[0]){
 repdb.get(`coin_${args[0]}`).then(value=>{
       return message.channel.send(new MessageEmbed().setDescription(`<@!${args[0]}>の所持金💵:\n${value} coins!`));
 })

}else {
  repdb.get(`coin_${message.author.id}`).then(value=>{
        return message.channel.send(new MessageEmbed().setDescription(`<@!${message.author.id}>の所持金💵:\n${value} coins!`));
  })
}}

config: { }