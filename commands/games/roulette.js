exports.run = (client, message, args) => {//woncount [1]
  const Discord = require('discord.js');
  const buff = require('../testbuffer.js');
  
    let currency = client.getCredits.get(message.author.id);
    if(!currency){
      message.channel.send("登録されていません\n登録コマンド:ps!login")
      return;
    }
    const Database = require("better-sqlite3");
    const db = new Database('./user_data/currency.sqlite');


    var betValueTest = false;
    var choiceValueTest = false;
    var dbCheck = false;



    var betConfirm = false;
    var userChoice = 'h';
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
                    description: "ルーレットゲーム",
                    fields: [{
                        name: "💣WELCOME TO ROULETTE!💣",
                        value: `3種類の色から一つを選んで賭けるゲーム。37個あるスロットのうち、18個が赤と黒、1つだけ緑がある`,
                        inline: true
                    },
                    {
                        name: "勝利条件",
                        value: `選んだ色と同じ色が出たら勝利
                        \n**RED**と**Black**だった場合は、賭けた額と同額がもらえます
                        \n**GREEN**だった場合は×16もらえます。`,
                        inline: true
                    },
                    {
                        name: "RULES",
                        value:`• ゲーム中の退出は禁止 - 負けそうだからってにげるなよ！\n• botの指示に従って進めてね - botが案内するのでよろしく`,
                        inline: true
                    }, {
                        name: "ベット額を送信してね:",
                        value: `**このチャンネルに入力してね**`,
                        inline: true
                    },
                    ]
                }
            })
            let usercoin = client.getCredits.get(message.author.id)
            console.log(betCollector);
            betCollector.on('collect', message => {
                if (message.content == 0 || message.content < 0) {
                    betCollector.stop([console.log("Incorrect user syntax.")])
                    return message.reply(`1coin以上かける必要があります`);
                }
                else if (isNaN(message.content)) {
                    betCollector.stop([console.log("Incorrect user syntax.")])
                    return message.reply(`ローマ数字で入力してください`);
                }
                else if (message.content/5 > usercoin.credits){
                  betCollector.stop(["too large amount bet"])
                  return message.reply(`bet額が大きすぎます(破産するよ)`)
                }
                else {
                    bet = parseInt(message.content);
                    
                    if (bet == message.content)
                        betValueTest = true;
                    else
                        betValueTest = false;

                    betCollector.stop([console.log("Bet recieved.")])
                    message.reply(`賭け金: **` + bet + ` coins!**`);

                    if (currency.credits < bet) {
                        betCollector.stop(console.log("Not enough user credits."))
                        message.reply(`足りないよ！\n所持金:${currency.credits}coins.`);
                        return;
                    }

                    betConfirm = true;
                    getUserInput();
                }
            })
        }
        else {
            
            const choiceCollector = new Discord.MessageCollector(message.channel, m => m.author.id == message.author.id, { time: 100000 });
            message.channel.send(
                {
                    embed: {
                        color: "RANDOM",
                        description: `**red**か**black**か**green**と入力してね:`
                    }
                }
            );
            console.log(choiceCollector);
            choiceCollector.on('collect', message => {
                if (message.content.toLowerCase() == "red" || message.content.toLowerCase() == 'r') {
                    userChoice = 'red';

                    
                    if ((message.content.toLowerCase() == "red" || "r") && userChoice == "red")
                        choiceValueTest = true;
                    else
                        choiceValueTest = false;

                    choiceCollector.stop([console.log("red")]);
                    message.reply(`redを選択しました`);
                    spinWheel();
                }
                else if (message.content.toLowerCase() == "black" || message.content.toLowerCase() == "b") {
                    userChoice = 'black';

                    
                    if ((message.content.toLowerCase() == "black" || "b") && userChoice == "black")
                        choiceValueTest = true;
                    else
                        choiceValueTest = false;

                    choiceCollector.stop([console.log("User picked black.")]);
                    message.reply(`blackを選択しました`);
                    spinWheel();
                }
                else if (message.content.toLowerCase() == "green" || message.content.toLowerCase() == "g") {
                    userChoice = 'green';

            
                    if ((message.content.toLowerCase() == "green" || "g") && userChoice == "green")
                        choiceValueTest = true;
                    else
                        choiceValueTest = false;

                    choiceCollector.stop([console.log("User picked green.")]);
                    message.reply(`greenを選択しました`);
                    spinWheel();
                }
                else {
                    choiceSyntaxTest = true;
                    choiceCollector.stop([console.log("Incorrect user syntax.")])
                    return message.reply(`red,black,greenから選択してください`);
                }
            })
        }
    }


    function spinWheel() {
        var wheelSlot = getRandomInt(36);
        var win = false;

        message.channel.send({
            files: [
                "./roulette.gif" 
            ]
        });
        setTimeout(() => {
            if(wheelSlot == 0){
                message.channel.send(
                    {
                        embed: {
                            color: "GREEN", 
                            description: "💚**GREEN**💚"

                        }
                    }
                );
            }
            else if (wheelSlot >= 1 && wheelSlot <= 16) {
                message.channel.send(
                    {
                        embed: {
                            color: "RED", 
                            description: "🔴**RED**🔴"

                        }
                    }
                );
            } else {
                message.channel.send(
                    {
                        embed: {
                            color: "BLACK", 
                            description: "⚫**BLACK**⚫"

                        }
                    }
                );
            }
            setTimeout(() => {
                
                if (wheelSlot == 0 && userChoice == "green"){
                    win = true;
                    
                    db.exec("UPDATE currency SET credits = credits + " + bet * 16 + " WHERE id = " + message.author.id + ";");
                    message.reply(`YOU WON ** ${bet*16} coins!**\n 所持金:${(currency.credits + bet*16)} coins.`);
                }
              
                else if (wheelSlot >= 1 && wheelSlot <= 16 && userChoice == "red"){
                    win = true;
                    
                    db.exec("UPDATE currency SET credits = credits + " + bet + " WHERE id = " + message.author.id + ";");
                    message.reply(`YOU WON ** ${bet} coins!**\n 所持金:${currency.credits + bet} coins.`);
                }
                
                else if (wheelSlot >= 17 && wheelSlot <= 36 && userChoice == "black"){
                    win = true;
                    
                    db.exec("UPDATE currency SET credits = credits + " + bet + " WHERE id = " + message.author.id + ";");
                    message.reply(`YOU WON ** ${bet} coins!** 所持金: ${currency.credits + bet} coins.`);
                }
                
                else{
                    win = false;
                    // Update database
                    db.exec("UPDATE currency SET credits = credits " + ((win) ? "+" : "-") + " " + bet + " WHERE id = " + message.author.id + ";");
                    message.reply(`YOU LOST ** ${bet} coins!** 所持金: ${currency.credits - bet} coins.`);
                }
                

              
                var newCurrency = client.getCredits.get(message.author.id);
                if (newCurrency.credits == ((win) ? (currency.credits + bet || currency.credits + bet * 36) : currency.credits - bet))
                    dbCheck = true;

                printTests();
            }, 1000);
        }, 3000);
    }

    function printTests() {//確認用
        console.log("\n");
        console.log("******roulette TESTS******");
        console.log("betValueTest: " + ((betValueTest) ? "PASSED" : "FAILED"));
        console.log("choiceValueTest: " + ((choiceValueTest) ? "PASSED" : "FAILED"));
        console.log("dbCheck: " + ((dbCheck) ? "PASSED" : "FAILED"));
        console.log("\n");
    }

    getUserInput();

  
    if (message.author == client.user) {
        buff.roulette = true;
    }
}


function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max + 1));
}
config: { }
  
