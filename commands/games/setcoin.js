const owners = require("./owners.json")
exports.run = (client, message, args) => {
  
    const Database = require("better-sqlite3");
    const db = new Database('./user_data/currency.sqlite');
		if (!owners.includes(message.author.id))
			return message.reply('このコマンドを実行する権限がないよ！');
		var amount = args[0];
		var user = message.mentions.users.first() || message.author;

    db.exec("UPDATE currency SET credits = "+ amount + " WHERE id = "+ user.id + ";");
		client.channels.cache.get('760785558510370826').send(`${message.author.tag}が${user.tag} のcoinを${amount}に設定したよ `);
 }