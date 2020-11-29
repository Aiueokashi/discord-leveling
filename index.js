const http = require('http');
http
	.createServer(function(req, res) {
		res.write('test');
		res.end();
	})
	.listen(8080);
function HTML_Load(_html, replace) {
	//Httpリクエスを作る
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open('GET', _html, true);
	xmlhttp.onreadystatechange = function() {
		//とれた場合Idにそって入れ替え
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			var data = xmlhttp.responseText;
			var elem = document.getElementById(replace);
			elem.innerHTML = data;
			return data;
		}
	};
	xmlhttp.send(null);
}
const Discord = require('discord.js');
const { MessageAttachment } = require('discord.js');
const { DiscordBattleShip } = require('discord-battleship');
const Minesweeper = require('discord.js-minesweeper');
const minigames = require('./commands/games/index.js');
const ms = require('parse-ms');
const data = require('quick.db');
const { Collection } = require('discord.js');
const leveling = require('discord-leveling');
const owners = require('./owners.json');
const blacklist = require('./blacklist.json');
const comand = require('./ignore.json');
const invites = {};
const wait = require('util').promisify(setTimeout);
const client = new Discord.Client();
const config = require('./json/config.json');
const Canvas = require('canvas');
const SQLite = require('better-sqlite3');
const sql = new SQLite('./user_data/currency.sqlite');
const Isql = new SQLite('./user_items/items.sqlite');
const fs = require('fs');
const ReactionRole = require('reaction-role');
const cooldowns = new Collection();
const HangmanGame = require('hangcord');
let chessClient = require('chess');
const canvacord = require('canvacord');
const RDatabase = require('@replit/database');
const repdb = new RDatabase();
let table = 'chess';
const TicTacToe = require('discord-tictactoe');
/*const HorsengelRoulette = require('./commands/games/RR.js')*/
const Voicechannels = [
	'760785559093510164',
	'760785559093510165',
	'760785559093510166',
	'760785559093510168',
	'760785559093510169',
	'760785559093510170',
	'760785559093510171',
	'760785559093510173',
	'766672307652919296',
  '778214552784863232'
];

const settings = {
	prefix: 'ps!'
};
new TicTacToe(
	{
		language: 'ja',
		command: 'ps!ttt'
	},
	client
);
const BattleShip = new DiscordBattleShip({
	embedColor: 'RANDOM',
	prefix: 'ps!'
});
const hangman = new HangmanGame()
	.setTitle('HANGMAN GAME')
	.setColor('RANDOM')
	.setTimestamp()
	.setWords(['word1', 'word2'])
	.pushWords(['word3', 'word4']);

const sendtime = {};
client.on('ready', async ready => {
	console.log('logged in');
	const logchannel = client.channels.cache.get('766162642682511400');
	sendtime[client.channels.cache.get('766162642682511400')] = Date.now();
	logchannel.send('pinging...').then(function(t) {
		t.edit(
			' ',
			new Discord.MessageEmbed()
				.setColor('GREEN')
				.setTitle('再起動')
				.setDescription(
					`ping:${Date.now() -
						sendtime[client.channels.cache.get('766162642682511400')]} ms`
				)
				.setFooter(`${client.user.tag} ディレクトリ:LevelingSystem`)
		);
	});
});

client.on('ready', async ready => {
	console.log('logged in');
	const logchannel2 = client.channels.cache.get('777400049893113876');
	sendtime[client.channels.cache.get('777400049893113876')] = Date.now();
	logchannel2.send('pinging...').then(function(t) {
		t.edit(
			' ',
			new Discord.MessageEmbed()
				.setColor('GREEN')
				.setTitle('再起動')
				.setDescription(
					`ping:${Date.now() -
						sendtime[client.channels.cache.get('777400049893113876')]} ms`
				)
				.setFooter(`${client.user.tag} ディレクトリ:LevelingSystem(レベリング部分)`)
		);
	});
});

client.on('ready', () => {
	console.log('Logged in');
});

client.on('guildMemberAdd', async member => {
	const canvas = Canvas.createCanvas(1200, 675);
	const ctx = canvas.getContext('2d');

	const imglist = new Array(
		'image1.jpg',
		'image2.jpg',
		'image3.jpg',
		'image4.jpg',
		'image5.jpg'
	);
	const selectnum = Math.floor(Math.random() * imglist.length);

	const background = await Canvas.loadImage(imglist[selectnum]);

	ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

	ctx.strokeStyle = '#74037b';
	ctx.strokeRect(0, 0, canvas.width, canvas.height);
	ctx.beginPath();
	ctx.arc(250, 250, 200, 0, Math.PI * 2, true);
	ctx.closePath();
	ctx.clip();

	const avatar = await Canvas.loadImage(
		member.user.displayAvatarURL({ format: 'jpg' })
	);
	ctx.drawImage(avatar, 50, 50, 400, 400);

	const attachment = new Discord.MessageAttachment(
		canvas.toBuffer(),
		'welcome-image.png'
	);

	let welcomeembed = new Discord.MessageEmbed()
		.setColor('RANDOM')
		.setTitle('新規さんよろしく！')
		.setDescription(
			`<@!${member.id}>が参加したよーよろ<@&${'762205538418688041'}>!!`
		)
		.setFooter('from:プロセカサーバー');

	let welcomeembed2 = new Discord.MessageEmbed()
		.setColor('RANDOM')
		.setTitle('ようこそ！')
		.setDescription(
			`<@!${
				member.id
			}>さん!ようこそプロジェクトセカイサーバーへ!!まずは <#${`760785558296330264`}> をよんで自己紹介して認証してね！`
		)
		.setFooter('from:プロセカサーバー');

	client.channels.cache.get('780311888814800916').send(welcomeembed);
	client.channels.cache.get('760785557927755794').send(welcomeembed2);
	client.channels.cache.get('780311888814800916').send(attachment);
	client.channels.cache.get('760785557927755794').send(attachment);
	member.roles.add('762198873652330508');
	console.log('sucsess!!');
});

client.on('message', async message => {
	if (message.author.bot) return;

	if (message.content.startsWith('ps!login')) {
		repdb.get(`coin_${message.author.id}`).then(value => {
			if (!value) {
				repdb.set(`coin_${message.author.id}`, 10000);
				message.reply(
					'サーバー内仮想通貨機能に正常に登録されました\n所持金:10000'
				);
			}
		});
	}

	if (message.content == '(╯°□°）╯︵ ┻━┻') {
		message.channel.send('┬─┬ ノ( ゜-゜ノ)');
	}

	var command = message.content
		.toLowerCase()
		.slice(settings.prefix.length)
		.split(' ')[0];

	var args = message.content.split(' ').slice(1);

	if (!cooldowns.has(command.name)) {
		//要改良
		cooldowns.set(command.name, new Collection());
	}

	if (message.author.bot) return;
	if (blacklist.includes(message.author.id)) return;

	if (command == 'hangman') {
		msg = message;
		hangman.newGame(msg);
	}

	if (
		command == 'mine' ||
		command == 'blackjack' ||
		command == 'deal' ||
		command == 'c-shuffle' ||
		command == 'setcoin' ||
		command == 'slot' ||
		command == 'coin-flip' ||
		command == 'coin' ||
		command == 'coinranking' ||
		command == 'roulette' ||
		command == 'daily' ||
		command == 'weekly' ||
		command == 'rank'
	) {
		let commandFile = require(`./commands/games/${command}.js`);
		commandFile.run(client, message, args);
	}
	/*if (command == 'RR' || command == 'rr' || command == 'russianroulette') {
      const hr = new HorsengelRoulette(message, message.member, message.mentions.members.first(), 'ps!');
        hr.load(6, 1);
        hr.start();
	}*/

	let member = message.mentions.members.first();
	if (command == 'battle') {
		if (!member) {
			return message.channel.send('対戦相手をメンションしてね');
		} else {
			minigames.startBattle(client, member, message);
		}
	}

	/*	if (command == 'ispy') {
		if (!member) {
			return message.channel.send('対戦相手をメンションしてね');
		} else {
			minigames.startISpy(member, message);
		}
	}*/
	if (message.content.toLowerCase().includes('ps!battleship'))
		await BattleShip.createGame(message);

	var profile = await leveling.Fetch(message.author.id);
	if (!comand.includes(message.content)) {
		leveling.AddXp(message.author.id, 1);
	}
	var routput = await leveling.Fetch(message.author.id);
	if (
		routput.level + 1 > 10 && //lvl.10
		!message.member.roles.cache.has('761895195885174804') &&
		message.guild.id === '760785556803944448'
	) {
		message.member.roles.add('761895195885174804');
		let lvl10embed = new Discord.MessageEmbed()
			.setColor('RANDOM')
			.setDescription(
				`<@!${message.author.id}>に<@&${'761895195885174804'}>を付与したよ`
			);
		message.channel.send(lvl10embed);
	}
	if (
		routput.level + 1 > 20 && //lvl.20
		!message.member.roles.cache.has('766846996115226664') &&
		message.guild.id === '760785556803944448'
	) {
		message.member.roles.add('766846996115226664');
		let lvl10embed = new Discord.MessageEmbed()
			.setColor('RANDOM')
			.setDescription(
				`<@!${message.author.id}>に<@&${'766846996115226664'}>を付与したよ`
			);
		message.channel.send(lvl10embed);
	}
	if (
		routput.level + 1 > 30 && //lvl.30
		!message.member.roles.cache.has('766848798088888350') &&
		message.guild.id === '760785556803944448'
	) {
		message.member.roles.add('766848798088888350');
		let lvl10embed = new Discord.MessageEmbed()
			.setColor('RANDOM')
			.setDescription(
				`<@!${message.author.id}>に<@&${'766848798088888350'}>を付与したよ`
			);
		message.channel.send(lvl10embed);
	}
	if (
		routput.level + 1 > 30 && //regular
		!message.member.roles.cache.has('760785556841300027') &&
		message.guild.id === '760785556803944448'
	) {
		message.member.roles.add('760785556841300027');
		let lvl10embed = new Discord.MessageEmbed()
			.setColor('RANDOM')
			.setDescription(
				`<@!${message.author.id}>に<@&${'760785556841300027'}>を付与したよ`
			);
		message.channel.send(lvl10embed);
	}
	if (
		routput.level + 1 > 40 && //lvl.40
		!message.member.roles.cache.has('766848960060194816') &&
		message.guild.id === '760785556803944448'
	) {
		message.member.roles.add('766848960060194816');
		let lvl10embed = new Discord.MessageEmbed()
			.setColor('RANDOM')
			.setDescription(
				`<@!${message.author.id}>に<@&${'766848960060194816'}>を付与したよ`
			);
		message.channel.send(lvl10embed);
	}
	if (
		routput.level + 1 > 40 && //veteran
		!message.member.roles.cache.has('760785556841300028') &&
		message.guild.id === '760785556803944448'
	) {
		message.member.roles.add('760785556841300028');
		let lvl10embed = new Discord.MessageEmbed()
			.setColor('RANDOM')
			.setDescription(
				`<@!${message.author.id}>に<@&${'760785556841300028'}>を付与したよ`
			);
		message.channel.send(lvl10embed);
	}
	if (
		routput.level + 1 > 50 && //lvl.50
		!message.member.roles.cache.has('766848051817086986') &&
		message.guild.id === '760785556803944448'
	) {
		message.member.roles.add('766848051817086986');
		let lvl10embed = new Discord.MessageEmbed()
			.setColor('RANDOM')
			.setDescription(
				`<@!${message.author.id}>に<@&${'766848051817086986'}>を付与したよ`
			);
		message.channel.send(lvl10embed);
	}
	if (
		routput.level + 1 > 60 && //lvl.60
		!message.member.roles.cache.has('766848901151850496') &&
		message.guild.id === '760785556803944448'
	) {
		message.member.roles.add('766848901151850496');
		let lvl10embed = new Discord.MessageEmbed()
			.setColor('RANDOM')
			.setDescription(
				`<@!${message.author.id}>に<@&${'766848901151850496'}>を付与したよ`
			);
		message.channel.send(lvl10embed);
	}
	if (
		routput.level + 1 > 60 && //master
		!message.member.roles.cache.has('760785556849557504') &&
		message.guild.id === '760785556803944448'
	) {
		message.member.roles.add('760785556849557504');
		let lvl10embed = new Discord.MessageEmbed()
			.setColor('RANDOM')
			.setDescription(
				`<@!${message.author.id}>に<@&${'760785556849557504'}>を付与したよ`
			);
		message.channel.send(lvl10embed);
	}
	if (
		routput.level + 1 > 70 && //lvl.70
		!message.member.roles.cache.has('766848563119521864') &&
		message.guild.id === '760785556803944448'
	) {
		message.member.roles.add('766848563119521864');
		let lvl10embed = new Discord.MessageEmbed()
			.setColor('RANDOM')
			.setDescription(
				`<@!${message.author.id}>に<@&${'766848563119521864'}>を付与したよ`
			);
		message.channel.send(lvl10embed);
	}
	if (
		routput.level + 1 > 80 && //lvl.80
		!message.member.roles.cache.has('766848724553957377') &&
		message.guild.id === '760785556803944448'
	) {
		message.member.roles.add('766848724553957377');
		let lvl10embed = new Discord.MessageEmbed()
			.setColor('RANDOM')
			.setDescription(
				`<@!${message.author.id}>に<@&${'766848724553957377'}>を付与したよ`
			);
		message.channel.send(lvl10embed);
	}
	if (
		routput.level + 1 > 90 && //lvl.90
		!message.member.roles.cache.has('766848767559073793') &&
		message.guild.id === '760785556803944448'
	) {
		message.member.roles.add('766848767559073793');
		let lvl10embed = new Discord.MessageEmbed()
			.setColor('RANDOM')
			.setDescription(
				`<@!${message.author.id}>に<@&${'766848767559073793'}>を付与したよ`
			);
		message.channel.send(lvl10embed);
	}
	if (
		routput.level + 1 > 100 && //lvl.100
		!message.member.roles.cache.has('766849599741886506') &&
		message.guild.id === '760785556803944448'
	) {
		message.member.roles.add('766849599741886506');
		let lvl10embed = new Discord.MessageEmbed()
			.setColor('RANDOM')
			.setDescription(
				`<@!${message.author.id}>に<@&${'766849599741886506'}>を付与したよ`
			);
		message.channel.send(lvl10embed);
	}
	if (
		routput.level + 1 > 100 && //grand
		!message.member.roles.cache.has('760785556849557505') &&
		message.guild.id === '760785556803944448'
	) {
		message.member.roles.add('760785556849557505');
		let lvl10embed = new Discord.MessageEmbed()
			.setColor('RANDOM')
			.setDescription(
				`<@!${message.author.id}>に<@&${'760785556849557505'}>を付与したよ`
			);
		message.channel.send(lvl10embed);
	}
	if (profile.xp > profile.level * profile.level * 4) {
		await leveling.AddLevel(message.author.id, 1);

		let proembed = new Discord.MessageEmbed()
			.setColor('RANDOM')
			.setTitle('LEVEL UP !!')
			.setThumbnail(message.author.avatarURL())
			.setDescription(
				`<@${message.author.id}>のレベルが${profile.level + 1}になったよ！`
			);
		client.channels.cache.get('761856418776875038').send(proembed);
		console.log(`levelup${message.author.tag}to${profile.level}`);
	}

	if (!message.content.startsWith(settings.prefix)) return;

	if (command === 'profile') {
		var user =
			message.mentions.users.first() ||
			client.users.cache.get(args[0]) ||
			message.author;

		var output = await leveling.Fetch(user.id);
		let waitembed1 = new Discord.MessageEmbed()
			.setColor('RANDOM')
			.setAuthor(message.author.username, message.author.avatarURL())
			.addField('**⌛ user情報取得中.**', 'ちょっと待っててね');

		var initMsg = await message.channel.send(waitembed1);
		let muser;
		if (message.mentions.users.first()) {
			muser = message.mentions.users.first();
		} else if (args[0]) {
			muser = client.users.cache.get(args[0]);
		} else {
			muser = message.author;
		}
		const member = message.guild.member(muser);
		const time = new Date(muser.createdAt).toLocaleString('ja-JP', {
			timeZone: 'Asia/Tokyo'
		});
		let status = {
			online: '<:online:757600736044384317> オンライン',
			undefined: '<:offline:757601342822023288> オフライン',
			dnd: '<:dnd:757601329752571976> 取り込み中',
			idle: '<:idle:757601313369620580> 退席中',
			null: 'エスケープ中'
		};
		let profembed = new Discord.MessageEmbed()
			.setColor('RANDOM')
			.setTitle('**ユーザー情報**')
			.addField('**ユーザー名**', muser.tag)
			.addField(
				'ニックネーム:',
				`${member.nickname !== null ? `${member.nickname}` : 'なし'}`,
				true
			)
			.addField('**ID**', muser.id)
			.addField('**level**', `lv.**${output.level}**`)
			.addField(
				'**levelUPまで.**',
				`あと**${Math.floor(output.level * output.level * 4) - output.xp}**xp`
			)
			.addField('**xp**', `xp:**${output.xp}**`)
			.addField(
				'**パソコン**',
				status[muser.presence.clientStatus.desktop] || 'オフライン'
			)
			.addField(
				'**モバイル**',
				status[muser.presence.clientStatus.mobile] || 'オフライン'
			)
			.addField(
				'**web版**',
				status[muser.presence.clientStatus.web] || 'オフライン'
			)
			.addField('**アカウント作成日**', time)
			.addField(
				'**役職**',
				`<@&${message.guild.member(muser)._roles.join('> <@&')}>`
			)
			.setThumbnail(muser.avatarURL())
			.setFooter(
				`コマンド使用者: ${message.author.username}#${
					message.author.discriminator
				}`
			);
		const card = new canvacord.Rank()
			.setUsername(muser.username)
			.setDiscriminator(muser.discriminator)
			.setLevel(output.level)
			.setCurrentXP(output.xp)
			.setRequiredXP(Math.floor(output.level * output.level * 4))
			.setStatus(user.presence.status)
			.setAvatar(user.displayAvatarURL({ format: 'png', size: 1024 }));
		const img = await card.build();
		setTimeout(() => {
			initMsg.edit(profembed);
			message.channel.send(new MessageAttachment(img, 'rank.png'));
		}, 2000);
	}

	if (command === 'setxp') {
		if (!owners.includes(message.author.id))
			return message.reply('このコマンドを実行する権限がないよ！');
		var amount = args[0];
		var user = message.mentions.users.first() || message.author;

		var output = await leveling.SetXp(user.id, amount);
		message.channel.send(`${user.tag} のxpを${amount}に設定したよ `);
	}

	if (command === 'setlevel') {
		if (!owners.includes(message.author.id))
			return message.reply('このコマンドを実行する権限がないよ！');
		var amount = args[0];
		var user = message.mentions.users.first() || message.author;

		var output = await leveling.SetLevel(user.id, amount);
		message.channel.send(`${user.tag} のlevelを${amount}に設定したよ `);
	}

	if (command === 'xpranking') {
		if (message.mentions.users.first()) {
			var output = await leveling.Leaderboard({
				search: message.mentions.users.first().id
			});
			message.channel.send(
				` ${message.mentions.users.first().tag}は${output.placement} 位だよ！`
			);
		} else {
			leveling
				.Leaderboard({
					limit: 7
				})
				.then(async users => {
					if (users[0])
						var firstplace = await message.guild.members.fetch(users[0].userid);
					if (users[1])
						var secondplace = await message.guild.members.fetch(
							users[1].userid
						);
					if (users[2])
						var thirdplace = await message.guild.members.fetch(users[2].userid);
					if (users[3])
						var fourthplace = await message.guild.members.fetch(
							users[3].userid
						);
					if (users[4])
						var fifthplace = await message.guild.members.fetch(users[4].userid);
					if (users[5])
						var sixthplace = await message.guild.members.fetch(users[5].userid);
					if (users[6])
						var seventhplace = await message.guild.members.fetch(
							users[6].userid
						);
					let leaderembed = new Discord.MessageEmbed()
						.setColor('RANDOM')
						.setTitle('プロセカサーバーのxpranking')
						.setThumbnail(message.guild.iconURL())
						.setDescription(
							`1位:**<@${users[0].userid}>** **lvl:${(users[0] &&
								users[0].level) ||
								'None'} xp:${(users[0] && users[0].xp) || 'None'}**\n2位:**<@${
								users[1].userid
							}>** **lvl:${(users[1] && users[1].level) ||
								'None'} xp:${(users[1] && users[1].xp) || 'None'}**\n3位:**<@${
								users[2].userid
							}>** **lvl:${(users[2] && users[2].level) ||
								'None'} xp:${(users[2] && users[2].xp) || 'None'}**\n4位:**<@${
								users[3].userid
							}>** **lvl:${(users[3] && users[3].level) ||
								'None'} xp:${(users[3] && users[3].xp) || 'None'}**\n5位:**<@${
								users[4].userid
							}>** **lvl:${(users[4] && users[4].level) ||
								'None'} xp:${(users[4] && users[4].xp) || 'None'}**\n6位:**<@${
								users[5].userid
							}>** **lvl:${(users[5] && users[5].level) ||
								'None'} xp:${(users[5] && users[5].xp) || 'None'}**\n7位:**<@${
								users[6].userid
							}>** **lvl:${(users[6] && users[6].level) ||
								'None'} xp:${(users[6] && users[6].xp) || 'None'}**`
						);
					message.channel.send(leaderembed);
				});
		}
	}

	if (command == 'delete') {
		var user = message.mentions.users.first();
		if (!user) return message.reply('ユーザをメンションしてね');

		if (!owners.includes(message.author.id))
			return message.reply('このコマンドを実行する権限がないよ！');

		var output = await leveling.Delete(user.id);
		if (output.deleted == true) return message.reply('deleted!!!');

		message.reply('Error: Could not find the user in database.');
	}

	if (command == 'lvl10test') {
		let lvl10embed = new Discord.MessageEmbed()
			.setColor('RANDOM')
			.setDescription(
				`<@!${message.author.id}>に<@&${'761895195885174804'}>を付与したよ`
			);
		if (!owners.includes(message.author.id)) return;
		message.channel.send(lvl10embed);
	}

	if (command == 'fakemsg') {
		let member =
			message.mentions.users.first() ||
			client.users.cache.get(args[0]) ||
			message.author;
		if (!member) return message.channel.send('err');
		let botmsg = args.slice(1).join(' ');
		if (!botmsg) return message.channel.send('er1r');
		message.channel
			.createWebhook(member.nickname || member.name, {
				avatar: member.displayAvatarURL({ format: 'png' })
			})
			.then(webhook => {
				if (message.member.hasPermission('MANAGE_MESSAGES')) {
					webhook.send(botmsg, {
						disableEveryone: true,
						disableMention: true
					});
					setTimeout(() => webhook.delete(), 5000);
					message.delete({ timeout: 500 });
					client.channels.cache
						.get('766162642682511400')
						.send(
							`${message.author.tag}が${
								message.channel.name
							}でfakemessageコマンドを使ったよ`
						);
				} else {
					return setTimeout(() => webhook.delete(), 5000);
				}
			});
	}
});
client.on('voiceStateUpdate', async function(oldState, newState) {
	if (oldState.channel === null) {
		repdb.set(`vTime_${newState.member.id}`, Date.now()).then(() => {});
		client.channels.cache.get('776393374181359636').send(
			new Discord.MessageEmbed()
				.setColor('GREEN')
				.setTitle('入室')
				.setDescription(
					`<@${newState.member.id}>が「${newState.channel.name}」に参加しました。`
				)
				.addField('ユーザータグ:', newState.member.user.tag)
				.setTimestamp()
		);
	}
	if (newState.channel === null) {
	  let output = await leveling.Fetch(oldState.member.id);
		repdb.get(`vTime_${oldState.member.id}`).then(async value => {
			if (!value) {
				return  client.channels.cache.get('776393374181359636').send(
			new Discord.MessageEmbed()
				.setColor('RED')
				.setTitle('退出')
				.setDescription(
					`<@${oldState.member.id}>が「${oldState.channel.name}」から退出しました。`
				)
				.addField('ユーザータグ:', oldState.member.user.tag)
				.setTimestamp()
		);
			} else {
			  var vtime =  Math.floor((Date.now() - value)/60000)
			  var outputt = await leveling.AddXp(oldState.member.id,vtime);
			  		client.channels.cache.get('776393374181359636').send(
			new Discord.MessageEmbed()
				.setColor('RED')
				.setTitle('退出')
				.setDescription(
					`<@${oldState.member.id}>が「${oldState.channel.name}」から退出しました。`)
				.addField(`獲得xp:`,`${Math.floor((Date.now() - value)/60000)}xp`)
				.addField('ユーザータグ:', oldState.member.user.tag)
				.setTimestamp()
		);
		repdb.delete(`vTime_${oldState.member.id}`).then(()=>{})
			}
		});

	}
});


client.login(process.env.token);
