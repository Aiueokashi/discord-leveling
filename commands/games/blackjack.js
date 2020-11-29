const Deck = require("./deck.js");//woncount [0]

exports.run = (client, message, args, userid) => {
    console.log("playing")

    const Discord = require("discord.js");
    const deck = Deck.newDeck();
    const RDatabase = require('@replit/database');
    const repdb = new RDatabase();
    repdb.get(`coin_${message.author.id}`).then(value=>
    {if(!value){
      message.channel.send("登録されていません\n登録コマンド:ps!login")
      return;
    }})


    var betConfirm = false;
    var bet = 1;

    function getUserInput() {
        if (!betConfirm) {
            const betCollector = new Discord.MessageCollector(message.channel, m => m.author.id == message.author.id, { time: 100000 });
            message.channel.send({
                embed: {
                    color: "RANDOM",
                    author: {
                        name: client.user.username,
                        icon_url: client.user.avatarURL
                    },
                    description: "ブラックジャックhelp",
                    fields: [{
                        name: "🃏WELCOME TO BLACKJACK!🃏",
                        value: `トランプカードのゲームだよ、もちろんしってるよね(圧)？`,
                        inline: true
                    },
                    {
                        name: "RULES",
                        value: `• ゲーム中の退出は禁止 - 負けそうだからってにげるなよ！\n• botの指示に従って進めてね - botが案内するのでよろしく`,
                        inline: true
                    }, {
                        name: "ベットする金額を送信してね",
                        value: `**整数を入力！！！！！！(0.5とかやんな)**`,
                        inline: true
                    },
                    ]
                }
            })
            repdb.get(`coin_${message.author.id}`).then(value=>{
            console.log(betCollector);
            betCollector.on('collect', message => {
                if (message.content == 0 || message.content < 0) {

                    return message.reply(`かならず1より大きな値を入力してください`);
                }
                else if (isNaN(message.content)) {

                    return message.reply(`ローマ数字で入力してください`);
                }
                else if (message.content/5 > value){
                  return message.reply(`bet額が大きすぎます(破産するよ)`)
                }
                else if (message.content === 'stop'){
                   betCollector.stop(['stop'])
                   return message.reply('終了のお知らせ')
                }
                else {
                    bet = parseInt(message.content);
                    betCollector.stop(["Bet recieved."])
                    message.reply(`ベット額:**` + bet + `coin**`);
                    betConfirm = true;
                    getUserInput();
                }
            })})
        }
        else {
            deck.shuffle()

            var dealerFirstCard = deck.deal();
            DealerHand.push(dealerFirstCard);

            var dealerSecondCard = deck.deal();
            DealerHand.push(dealerSecondCard);

            CardUp = dealerSecondCard; 
            CardDown = '🃏';


            var firstCard = deck.deal();
            arr.push(firstCard); 

            var secondCard = deck.deal();
            arr.push(secondCard); 

            for (i = 0; i < arr.length; i++) {
                var card = arr[i];

                var num = card.substring(0, 1);
                num = num.trim();
                console.log(num);
                if (num == 'j' || num == 'q' || num == 'k' || num == 't') {
                    num = 10;
                } else if (num == 'a') {
                    if (total <= 10) {
                        num = 11;
                    } else {
                        num = 1;
                    }
                }
                console.log(total);
                total += parseInt(num, 10);
            }

            var printFormat = arr.join(''); 

            var sendEmbed =
            message.channel.send({
                embed: {
                    color: "RANDOM",
                    author: {
                        name: client.user.username,
                        icon_url: client.user.avatarURL
                    },
                    fields: [{
                        name: "手札",
                        value: printFormat,
                        inline: true
                    },
                    {
                        name: "ディーラーの手札",
                        value: `${CardUp}/${CardDown}`,
                        inline: true
                    }, {
                        name: "**hit**か**stand**と入力してね:",
                        value: `**トータル: ${total}**`,
                        inline: false
                    },
                    ]
                }
            })
            sendEmbed;

          
            const choiceCollector = new Discord.MessageCollector(message.channel, m => m.author.id == message.author.id, { time: 100000 });
            console.log(choiceCollector);
            choiceCollector.on('collect', message => {
                if (message.content.toLowerCase() == "hit" || message.content.toLowerCase() == 'h') {
                    userChoice = 'h';
                    choiceCollector.stop(["User picked hit."]);
                    hit(sendEmbed);
                }
                else if (message.content.toLowerCase() == "stand" || message.content.toLowerCase() == "s") {
                    userChoice = 't';
                    choiceCollector.stop(["User picked stand."]);
                    stand(sendEmbed);
                }
                else if (message.content === 'stop'){
                    betCollector.stop(['stop'])
                    return message.reply('終了のお知らせ')
                }
                else {
                    return message.reply(`**ERROR**hitかstandと入力してね`);
                }
            })
        }
    }


    var arr = []; 
    var DealerHand = []; 
    var total = 0; 
    var CardUp; 
    var CardDown; 


    function hit(sendEmbed) {

 
        var newCard = deck.deal();
        arr.push(newCard);

        total = 0; 


        for (i = 0; i < arr.length; i++) {
            var card = arr[i];

            var num = card.substring(0, 1);
            num = num.trim();
            console.log(num);
            if (num == 'j' || num == 'q' || num == 'k' || num == 't') {
                num = 10;
            } else if (num == 'a') {
                if (total <= 10) {
                    num = 11;
                } else {
                    num = 1;
                }
            }
            console.log(total);
            total += parseInt(num, 10);
        }

        var printFormat = arr.join(''); 


        if (total <= 21) {
            sendEmbed.then((msg) => {
                msg.edit({
                    embed: {
                        color: "RANDOM", 
                        author: {
                            name: client.user.username,
                            icon_url: client.user.avatarURL
                        },
                        fields: [{
                            name: "手札",
                            value: printFormat,
                            inline: true
                        },
                        {
                            name: "ディーラーの手札",
                            value: `${CardUp}/${CardDown}`,
                            inline: true
                        }, {
                            name: "**HIT**か**STAND**と入力してね:",
                            value: `**トータル: ${total}**`,
                            inline: false
                        },
                        ]
                    }
                })
            })
        }

       
        if (total > 21) {
            busted(sendEmbed);
            return;
        }


        const choiceCollector = new Discord.MessageCollector(message.channel, m => m.author.id == message.author.id, { time: 100000 });
        console.log(choiceCollector);
        choiceCollector.on('collect', message => {
            if (message.content.toLowerCase() == "hit" || message.content.toLowerCase() == 'h') {
                userChoice = 'h';
                choiceCollector.stop(["User picked hit."]);
                hit(sendEmbed);
            }
            else if (message.content.toLowerCase() == "stand" || message.content.toLowerCase() == "s") {
                userChoice = 't';
                choiceCollector.stop(["User picked stand."]);
                stand(sendEmbed);
            }
            else if (message.content === 'stop'){
                    betCollector.stop(['stop'])
                    return message.reply('終了のお知らせ')
                }
            else {
                return message.reply(`**ERROR**hitかstandと入力してね`);
            }
        })

    } // ---------------------- HIT -------------------------

    // ---------------------- STAND -------------------------
    function stand(sendEmbed) {

        DealerTotal = 0;

        for (i = 0; i < DealerHand.length; i++) {
            var card = DealerHand[i];
            var num = card.substring(0, 1);
            num = num.trim();
            console.log(num);
            if (num == 'j' || num == 'q' || num == 'k' || num == 't') {
                num = 10;
            } else if (num == 'a') {
                if (total <= 10) {
                    num = 11;
                } else {
                    num = 1;
                }
            }
            console.log(total);
            DealerTotal += parseInt(num, 10);
        }

     
        while (DealerTotal < 17) {
            var anotherCard = deck.deal();
            DealerHand.push(anotherCard);

            var num = anotherCard.substring(0, 1);
            num = num.trim();

            console.log(num);
            if (num == 'j' || num == 'q' || num == 'k' || num == 't') {
                num = 10;
            } else if (num == 'a') {
                if (total <= 10) {
                    num = 11;
                } else {
                    num = 1;
                }
            }
            console.log(total);
            DealerTotal += parseInt(num, 10);
        }

        var printFormat = arr.join(''); 
        var printFormatDealer = DealerHand.join(''); 
        
        sendEmbed.then((msg) => {
            msg.edit({
                embed: {
                    color:"RANDOM", 
                    author: {
                        name: client.user.username,
                        icon_url: client.user.avatarURL
                    },
                    fields: [{
                        name: "手札\n",
                        value: printFormat,
                        inline: false
                    }, {
                        name: "トータルL\n",
                        value: total,
                        inline: false
                    },
                    {
                        name: "ディーラーの手札\n",
                        value: printFormatDealer,
                        inline: false
                    }, {
                        name: "ディーラートータル\n",
                        value: DealerTotal,
                        inline: false
                    },
                    ]
                }
            })
        })

        if (DealerTotal == total) {
            db.get(`coin_${message.author.id}`).then(value =>
            {message.reply(`YOU PUSHED **` + bet + ` coins!**\n 所持金: ${value} coins.`);
        })
        }
        else if(total == 21){
          win = true; 
          repdb.get(`coin_${message.author.id}`).then(value => {
            repdb.set(`coin_${message.author.id}`,value+bet*6).then(()=>{
              message.reply(`YOU BIG WON **` + bet*6 + ` coins!**\n 所持金: ${value + bet*6} coins.`);
            })
          })
        } 
        
        else if (DealerTotal < total || DealerTotal > 21) {
            win = true; 
            repdb.get(`coin_${message.author.id}`).then(value => {
              repdb.set(`coin_${message.author.id}`,value+bet).then(()=>{
                message.reply(`YOU WON **` + bet + ` coins!**\n 所持金: ${value + bet} coins.`);
              })
            })
        } else {
            win = false; 
            repdb.get(`coin_${message.author.id}`).then(value => {
              repdb.set(`coin_${message.author.id}`,value-bet).then(()=>{
               message.reply(`YOU LOST **` + bet + ` coins!**\n 所持金: ${value - bet} coins.`);  
              })
            })
        }
    } // ---------------------- STAND -------------------------

    // ---------------------- BUST -------------------------
    function busted(sendEmbed) {
        var printFormat = arr.join('');

        sendEmbed.then((msg) => {
            msg.edit({
                embed: {
                    color: "RANDOM", 
                    author: {
                        name: client.user.username,
                        icon_url: client.user.avatarURL
                    },
                    fields: [{
                        name: "手札\n",
                        value: printFormat,
                        inline: false
                    }, {
                        name: "トータル(**BUSTED**)\n",
                        value: total,
                        inline: false
                    }]
                }
            })
        })

        
        win = false; 
        repdb.get(`coin_${message.author.id}`).then(value=>{
          repdb.set(`coin_${message.author.id}`,value-bet).then(()=>{
              message.reply(`YOU LOST **` + bet + ` coins!**\n 所持金: ${value - bet} coins.`);
          })
        })
     

    }  // ---------------------- BUST -------------------------

    getUserInput();
}

config: { }