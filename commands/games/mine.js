const Minesweeper = require('discord.js-minesweeper');
const Discord = require('discord.js');

exports.run = (client, message, args)=>{
    const RDatabase = require('@replit/database');
    const repdb = new RDatabase();
    repdb.get(`coin_${message.author.id}`).then(value=>
    {if(!value){
      message.channel.send("登録されていません\n登録コマンド:ps!login")
      return;
    }})

    const rows = parseInt(args[0]);
    const columns = parseInt(args[1]);
    const mines = parseInt(args[2]);
 
    const minesweeper = new Minesweeper({ rows, columns, mines });
    const matrix = minesweeper.start();
 
    return matrix
      ? message.channel.send(matrix)
      : message.channel.send('範囲外の値です');
  }
