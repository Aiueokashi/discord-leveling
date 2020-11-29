const deck = require("./deck.js");
const buff = require('../testbuffer.js');

exports.run = (client, message, args) => {

    const RDatabase = require('@replit/database');
    const repdb = new RDatabase();
    repdb.get(`coin_${message.author.id}`).then(value=>
    {if(!value){
      message.channel.send("登録されていません\n登録コマンド:ps!login")
      return;
    }})
    var card = deck.shuffle(message.author.id);

    message.channel.send("Pinging...").then(function(m){
        m.edit(` 🎰 **CARD SHUFFLING** 🎰 - Took: ${m.createdTimestamp - message.createdTimestamp}ms\n(フリだと思ってる？プログラム上では本当にシャッフルしてるよ!)`)
    })

  
    if (message.author == client.user) {

        buff.shuffle = true;
        console.log(buff.shuffle);
    }

}
config: {}