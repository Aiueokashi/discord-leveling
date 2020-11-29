exports.run = (client, message, args) => {//woncount [2]

    const buff = require('../testbuffer.js');

    const Discord = require("discord.js");


    
    const RDatabase = require('@replit/database');
    const repdb = new RDatabase();
    repdb.get(`coin_${message.author.id}`).then(value=>
    {if(!value){
      message.channel.send("登録されていません\n登録コマンド:ps!login")
      return;
    }})


  
    var smwin = 100;        
    var bwin = 1000;
    var loose = -25;        

    let slots = ["🍎", "🍌", "🍊", "🍐", "🍒"];
    let result1 = Math.floor((Math.random() * slots.length));
    let result2 = Math.floor((Math.random() * slots.length));
    let result3 = Math.floor((Math.random() * slots.length));
    let name = message.author.displayName;
    let icon = message.author.displayAvatarURL;

    if (slots[result1] === slots[result2] && slots[result2] === slots[result3]) {
        let wEmbed = new Discord.MessageEmbed()
            .setFooter('YOU BIG WON!!', icon)
            .setTitle(':slot_machine: Slots :slot_machine:')
            .addField('結果:', slots[result1] +"|"+ slots[result2]+"|" + slots[result3], true)
            .setColor("RANDOM")
        db.exec("UPDATE currency SET credits = credits + " + bwin + " WHERE id = " + message.author.id + ";");
        message.reply(`YOUWON` + `**` + bwin + ` coins!** 所持金: ${currency.credits + bwin} coin.`);
        message.channel.send(wEmbed)
    }

    else if (slots[result1] === slots[result2]) {
        let wEmbed = new Discord.MessageEmbed()
            .setFooter('YOU SMALL WON!!', icon)
            .setTitle(':slot_machine: Slots :slot_machine:')
            .addField('結果:', slots[result1] +"|"+ slots[result2] +"|"+ slots[result3], true)
            .setColor("RANDOM")
        db.exec("UPDATE currency SET credits = credits + " + smwin + " WHERE id = " + message.author.id + ";");
        message.reply(`YOU WON` + `**` + smwin + ` coins!** 所持金: ${currency.credits + smwin} coins.`);
        message.channel.send(wEmbed)
    }
    else {
        let lEmbed = new Discord.MessageEmbed()
            .setFooter('YOU LOST!!!', icon)
            .setTitle(':slot_machine: Slots :slot_machine:')
            .addField('結果:', slots[result1] +"|"+ slots[result2] +"|"+ slots[result3], true)
            .setColor("RANDOM")
        db.exec("UPDATE currency SET credits = credits + " + loose + " WHERE id = " + message.author.id + ";");
        message.reply(`YOU LOST` + `**` + loose + ` coins!** 所持金: ${currency.credits + loose} coins.`);
        message.channel.send(lEmbed)
    }
    
    if (message.author == client.user) {

        buff.slot = true;
        console.log(buff.slot);
    }

}



config: { }