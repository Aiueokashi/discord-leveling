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

    var card = deck.deal(message.author.id);

    message.channel.send("Pinging...").then(function (m) {
        m.edit(` 🎰 **DEALING** 🎰 ${card}- かかった時間: ${m.createdTimestamp - message.createdTimestamp}ms`)

    })

  
    if (message.author == client.user) {

        buff.deal = true;
        console.log(buff.deal);
    }
}
config: { }