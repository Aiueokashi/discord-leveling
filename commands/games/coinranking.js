const buff = require('../testbuffer.js');
const RDatabase = require('@replit/database');
const repdb = new RDatabase();
exports.run = (client, message, args) => {
	repdb.get(`coin_${message.author.id}`).then(value => {
		if (!value) {
			message.channel.send('登録されていません\n登録コマンド:ps!login');
			return;
		}
	});
	repdb.list(`coin_`).then(matches => {
	  var list = matches.replace('coin_','a_');
	  console.log(list)
	});

	var temp = leaders.all();
	var user = users.all();
	var index;
	for (var i = 0; i < user.length; i++) {
		if (user[i].id == message.author.id) {
			index = i;
			break;
		}
	}
	console.log(index);
	message.channel.send({
		embed: {
			color: 'RANDOM',
			author: {
				name: client.user.username + ' Leaderboards',
				icon_url: client.user.avatarURL
			},
			description: '**仮想通貨leaderboard**',
			fields: [
				{
					name: '**TOP 10**',
					value: `**#1 🥇 ${temp.length >= 1 ? temp[0].user : 'N/A'}** - ${
						temp.length >= 1 ? temp[0].credits : 'N/A'
					} coins!
                **#2 🥈 ${temp.length >= 2 ? temp[1].user : 'N/A'}** - ${
						temp.length >= 2 ? temp[1].credits : 'N/A'
					} coins!
                **#3 🥉${temp.length >= 3 ? temp[2].user : 'N/A'}** - ${
						temp.length >= 3 ? temp[2].credits : 'N/A'
					} coins!
                **#4 ${temp.length >= 4 ? temp[3].user : 'N/A'}** - ${
						temp.length >= 4 ? temp[3].credits : 'N/A'
					} coins!
                **#5 ${temp.length >= 5 ? temp[4].user : 'N/A'}** - ${
						temp.length >= 5 ? temp[4].credits : 'N/A'
					} coins!
                **#6 ${temp.length >= 6 ? temp[5].user : 'N/A'}** - ${
						temp.length >= 6 ? temp[5].credits : 'N/A'
					} coins!
                **#7 ${temp.length >= 7 ? temp[6].user : 'N/A'}** - ${
						temp.length >= 7 ? temp[6].credits : 'N/A'
					} coins!
                **#8 ${temp.length >= 8 ? temp[7].user : 'N/A'}** - ${
						temp.length >= 8 ? temp[7].credits : 'N/A'
					} coins!
                **#9 ${temp.length >= 9 ? temp[8].user : 'N/A'}** - ${
						temp.length >= 9 ? temp[8].credits : 'N/A'
					} coins!
                **#10 ${temp.length >= 10 ? temp[9].user : 'N/A'}** - ${
						temp.length >= 10 ? temp[9].credits : 'NA'
					} coins!`,
					inline: true
				},
				{
					name: 'あなたの順位',
					value: `**#${index + 1} ${user[index].user}** - ${
						user[index].credits
					} coins\n`,
					inline: true
				}
			],
			timestamp: new Date(),
			footer: {
				icon_url: message.author.avatarURL,
				text: `コマンド使用者: ${message.author.tag}`
			}
		}
	});

	if (message.author == client.user) {
		buff.leader = true;
		console.log(buff.leader);
	}
};
