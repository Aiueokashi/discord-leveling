const { MessageEmbed } = require('discord.js');
let attacks = ['atk', 'アタック', '360 no scope', 'パンチ', 'キック', '👊'];
let heals = ['hel', 'ヒール', 'chew 5 gum', 'ポーション', 'ヘルス', '❤️'];
let botatack= ['atk', 'アタック', '360 no scope', 'パンチ', 'キック','hel', 'ヒール', 'chew 5 gum', 'ポーション', 'ヘルス']
let chance = ['yes', 'yes', 'no', 'yes', 'yes', 'no', 'yes', 'yes'];
let selfchance = ['yes','yes','yes','yes','yes','yes','yes','yes','yes','yes','yes','yes','yes','yes','yes','yes','yes','yes','yes','yes','yes','yes','yes','yes','yes','yes','yes','yes','yes','yes','yes','yes','yes','yes','yes','yes','yes','yes','yes','no']

exports.createBattle = async function(client, member, message) {
    const RDatabase = require('@replit/database');
    const repdb = new RDatabase();
    repdb.get(`coin_${message.author.id}`).then(value=>
    {if(!value){
      message.channel.send("登録されていません\n登録コマンド:ps!login")
      return;
    }})

	const settings = {
		health: 175,
		attackMin: 10,
		attackMax: 50,
		healMin: 5,
		healMax: 35,
		bet: 1000
	};
	const selfPlayer = {
	  health:200,
	  attackMin:10,
	  attackMax:100,
	  healMin:1,
	  healMax:15
	}
	const hackedsettings = {
		health: 999,
		attackMin: 3,
		attackMax: 30,
		healMin: 1,
		healMax: 10
	};
	const playerOneData = {
		id: message.author.id,
		battleHealth: settings.health,
		battleActive: false,
		battleTurn: false
	};
	const playerSData = {
	  id:message.author.id,
	  battleHealth:selfPlayer.health,
	  battleActive:false,
	  battleTurn:false
	};
	const playerTwoData = {
		id: member.id,
		battleHealth: settings.health,
		battleActive: false,
		battleTurn: false
	};
	const playerBotData = {
		id: client.id,
		battleHealth: hackedsettings.health,
		battleActive: false,
		battleTurn: false
	};
	if (!member.id || !message.author)
		return message.reply('対戦を申し込む相手をメンションしてね');
	if (member.id === message.author.id)
		return message.reply('ぼっち..?なの...?');
	if (member.id === client.user.id) {
		return selfstart(
			member,
			message.channel,
			message.author.id,
			member.id,
			message
		);
	} else if (member.user.bot) {
		return message.reply('botとは遊べないよ');
	}
	return start(member, message.channel, message.author.id, member.id, message);

	async function start(member, channel, playerOne, playerTwo, message) {
		await channel
			.send(
				` ${member}さん！あなたは${
					message.author
				}に対戦を申し込まれました！(30s)`
			)
			.then(async msg => {
				await msg.react('✅');
				await msg.react('❌');
				const filter = (reaction, user) =>
					reaction.emoji.name === '❌' && user.id === playerTwo;
				const no = msg.createReactionCollector(filter, {
					time: 30000,
					max: 1
				});
				const filter2 = (reaction, user) =>
					reaction.emoji.name === '✅' && user.id === playerTwo;
				const yes = msg.createReactionCollector(filter2, {
					time: 30000,
					max: 1
				});

				no.on('collect', async collected => {
					await msg.edit('断られてしまった...');
					await yes.stop();
				});
				yes.on('collect', async collected => {
					if (
						(playerOneData.battleActive === true &&
							playerOneData.id === playerOne) ||
						(playerTwoData.battleActive === true &&
							playerOneData.id === playerTwo)
					)
						return msg.edit('バトルに参加しました');
					await no.stop();
					return accept(channel, playerOne, playerTwo, message, member);
				});
				setTimeout(() => {
					if (
						playerOneData.battleActive === false &&
						playerOneData.battleActive === false
					) {
						return msg.edit('逃げてしまったようだ');
					}
				}, 15000);
			});
	}

	async function selfstart(member, channel, playerOne, playerBot, message) {
		await channel.send(
			` ${member}さん！あなたは${message.author}に対戦を申し込まれました！(30s)`
		);
		if (
			(playerOneData.battleActive === true && playerOneData.id === playerOne) ||
			(playerBotData.battleActive === true && playerOneData.id === playerBot)
		)
			channel.send('バトルに参加しました');
		return selfaccept(channel, playerOne, playerBot, message, member);
	}

	async function selfaccept(channel, playerOne, playerBot, message, member) {
		playerOneData.battleActive = true;
		playerBotData.battleActive = true;
		channel
			.send(
				new MessageEmbed()
					.setTitle('Settings')
					.setDescription(
						`あなたのステータス:\nhealth: \`${selfPlayer.health}\`\nheal min: \`${
							selfPlayer.healMin
						}\` | heal max: \`${selfPlayer.healMax}\`\nattack min: \`${
							selfPlayer.attackMin
						}\` | attack max: \`${
							selfPlayer.attackMax
						}\`\n\n敵のステータス:\n**health: ${
							hackedsettings.health
						}**\nheal min: \`${hackedsettings.healMin}\` |** heal max: ${
							hackedsettings.healMax
						}**\nattack min: \`${hackedsettings.attackMin}\` | attack max: \`${
							hackedsettings.attackMax
						}\n"start" \`と送信すると\` ゲームを開始します`
					)
					.setColor('RANDOM')
					.setFooter(
						message.member.displayName,
						message.author.displayAvatarURL()
					)
			)
			.then(async started => {
				let filter1 = msg => msg.author.id === playerOne;
				let setSettings = channel.createMessageCollector(filter1, {
					time: 120000
				});

				setSettings.on('collect', async msg => {
					let args = msg.content.split(/ +/);
					if (args[0] === 'start') {
						await setSettings.stop();
						await selffirst(channel, playerOne, playerBot, message);
						return channel.send(
							new MessageEmbed()
								.setTitle('Battle!')
								.setDescription(
									`Player1: <@${playerOne}> \`HP: ${
										playerOneData.battleHealth
									}\`\nPlayer2: <@${playerBot}> \`HP: ${
										playerBotData.battleHealth
									}\`\n\nAttacks: \`${attacks.join(
										', '
									)}\`\nHealing: \`${heals.join(
										', '
									)}\`\n\n--end \`を使うと\`ターンが終了します `
								)
								.setColor('RED')
								.setFooter(message.author.username, message.author.avatarURL())
						);
					}
				});
			});
	}

	async function accept(channel, playerOne, playerTwo, message, member) {
		playerOneData.battleActive = true;
		playerTwoData.battleActive = true;
		channel
			.send(
				new MessageEmbed()
					.setTitle('Settings')
					.setDescription(
						`現在の設定\nhealth: \`${settings.health}\`\nheal min: \`${
							settings.healMin
						}\` | heal max: \`${settings.healMax}\`\nattack min: \`${
							settings.attackMin
						}\` | attack max: \`${
							settings.attackMax
						}\`\n"start" \`と送信すると\` ゲームを開始します`
					)
					.setColor('RANDOM')
					.setFooter(
						message.member.displayName,
						message.author.displayAvatarURL()
					)
			)
			.then(async started => {
				let filter1 = msg => msg.author.id === playerOne;
				let setSettings = channel.createMessageCollector(filter1, {
					time: 120000
				});

				setSettings.on('collect', async msg => {
					let args = msg.content.split(/ +/);
					if (args[0] === 'start') {
						await setSettings.stop();
						await first(channel, playerOne, playerTwo, message);
						return channel.send(
							new MessageEmbed()
								.setTitle('Battle!')
								.setDescription(
									`Player1: <@${playerOne}> \`HP: ${
										playerOneData.battleHealth
									}\`\nPlayer2: <@${playerTwo}> \`HP: ${
										playerTwoData.battleHealth
									}\`\n\nAttacks: \`${attacks.join(
										', '
									)}\`\nHealing: \`${heals.join(
										', '
									)}\`\n\n--end \`を使うと\`ターンが終了します `
								)
								.setColor('RED')
								.setFooter(message.author.username, message.author.avatarURL())
						);
					}
				});
			});
	}

	async function selffirst(channel, playerOne, playerBot, message) {
		let nowBattling = channel.guild.members.cache.get(playerOne);
		let nextUp = channel.guild.members.cache.get(playerBot);

		let filter = msg => msg.author.id === nowBattling.id;
		let collector = channel.createMessageCollector(filter);
		if (playerOneData.battleTurn === true) return;
		playerOneData.battleTurn = true;

		if (playerOneData.battleHealth <= 0) {
			return selfend(channel, playerOne, playerBot, playerBot);
		}

		collector.on('collect', async msg => {
			if (
				msg.content.toLowerCase() === '--end' 
			) {
				let winner;
				if (playerOneData.battleHealth >= playerBotData.battleHealth)
					winner = playerOne;
				if (playerOneData.battleHealth < playerBotData.battleHealth)
					winner = playerBot;
				await collector.stop();
				return selfend(channel, playerOne, playerBot, winner);
			}

			var i;
			for (i = 0; i < attacks.length; i++) {
				if (msg.content.toLowerCase() === attacks[i]) {
					let attackAmount =
						Math.floor(
							Math.random() * (settings.attackMax - settings.attackMin)
						) + settings.attackMin;
					let attackChance = Math.floor(Math.random() * selfchance.length);
					if (selfchance[attackChance] === 'yes') {
						playerBotData.battleHealth -= attackAmount;
						playerOneData.battleTurn = false;
						await collector.stop();
						await channel.send(
							new MessageEmbed()
								.setDescription(
									`${nowBattling} が**${
										attacks[i]
									}** を使った！ \`${attackAmount}\`ダメージを与えた\n ${nextUp}の残体力: \`${
										playerBotData.battleHealth
									}\` HP`
								)
								.setColor('RED')
								.setAuthor(
									`Attacker: ${nowBattling.displayName}`,
									nowBattling.user.displayAvatarURL()
								)
								.setFooter(
									`Next Attacker: ${nextUp.displayName}`,
									nextUp.user.displayAvatarURL()
								)
						);
						return selfsecond(channel, playerOne, playerBot, message);
					} else if (chance[attackChance] === 'no') {
						playerOneData.battleTurn = false;
						await collector.stop();
						await channel.send(
							new MessageEmbed()
								.setDescription(
									`${nowBattling} が **${
										attacks[i]
									}** を使用した！が、よけられた \n${nextUp}の残体力: \`${
										playerBotData.battleHealth
									}\` HP`
								)
								.setColor('RED')
								.setAuthor(
									`Attacker: ${nowBattling.displayName}`,
									nowBattling.user.displayAvatarURL()
								)
								.setFooter(
									`Next Attacker: ${nextUp.displayName}`,
									nextUp.user.displayAvatarURL()
								)
						);
						await selfsecond(channel, playerOne, playerBot, message);
					}
				}
			}

			var x;
			for (x = 0; x < heals.length; x++) {
				if (msg.content.toLowerCase() === heals[x]) {
					let healAmount =
						Math.floor(Math.random() * (settings.healMax - settings.healMin)) +
						settings.healMin;
					let healChance = Math.floor(Math.random() * chance.length);
					if (chance[healChance] === 'yes') {
						playerOneData.battleHealth += healAmount;
						playerOneData.battleTurn = false;
						await collector.stop();
						await channel.send(
							new MessageEmbed()
								.setDescription(
									`${nowBattling} が **${
										heals[x]
									}** を使用した！\`${healAmount}\` HP回復した！, 残体力:\`${
										playerOneData.battleHealth
									}\` HP!`
								)
								.setColor('GREEN')
								.setAuthor(
									`Healer: ${nowBattling.displayName}`,
									nowBattling.user.displayAvatarURL()
								)
								.setFooter(
									`Next Attacker: ${nextUp.displayName}`,
									nextUp.user.displayAvatarURL()
								)
						);
						return selfsecond(channel, playerOne, playerBot, message);
					} else if (chance[healChance] === 'no') {
						playerOneData.battleTurn = false;
						await collector.stop();
						await channel.send(
							new MessageEmbed()
								.setDescription(
									`${nowBattling} が **${
										heals[x]
									}**を使った！が、効果はいまひとつのようだ... \n残体力:\`${
										playerBotData.battleHealth
									}\` HP!`
								)
								.setColor('GREEN')
								.setAuthor(
									`Healer: ${nowBattling.displayName}`,
									nowBattling.user.displayAvatarURL()
								)
								.setFooter(
									`Next Attacker: ${nextUp.displayName}`,
									nextUp.user.displayAvatarURL()
								)
						);
						return selfsecond(channel, playerOne, playerBot, message);
					}
				}
			}
		});
	}

	async function first(channel, playerOne, playerTwo, message) {
		let nowBattling = channel.guild.members.cache.get(playerOne);
		let nextUp = channel.guild.members.cache.get(playerTwo);

		let filter = msg => msg.author.id === nowBattling.id;
		let collector = channel.createMessageCollector(filter);
		if (playerOneData.battleTurn === true) return;
		playerOneData.battleTurn = true;

		if (playerOneData.battleHealth <= 0) {
			return end(channel, playerOne, playerTwo, playerTwo);
		}

		collector.on('collect', async msg => {
			if (
				msg.content.toLowerCase() === '--end' 
			) {
				let winner;
				if (playerOneData.battleHealth >= playerTwoData.battleHealth)
					winner = playerOne;
				if (playerOneData.battleHealth < playerTwoData.battleHealth)
					winner = playerTwo;
				await collector.stop();
				return end(channel, playerOne, playerTwo, winner);
			}

			var i;
			for (i = 0; i < attacks.length; i++) {
				if (msg.content.toLowerCase() === attacks[i]) {
					let attackAmount =
						Math.floor(
							Math.random() * (settings.attackMax - settings.attackMin)
						) + settings.attackMin;
					let attackChance = Math.floor(Math.random() * chance.length);
					if (chance[attackChance] === 'yes') {
						playerTwoData.battleHealth -= attackAmount;
						playerOneData.battleTurn = false;
						await collector.stop();
						await channel.send(
							new MessageEmbed()
								.setDescription(
									`${nowBattling} が**${
										attacks[i]
									}** を使った！ \`${attackAmount}\`ダメージを与えた\n ${nextUp}の残体力: \`${
										playerTwoData.battleHealth
									}\` HP`
								)
								.setColor('RED')
								.setAuthor(
									`Attacker: ${nowBattling.displayName}`,
									nowBattling.user.displayAvatarURL()
								)
								.setFooter(
									`Next Attacker: ${nextUp.displayName}`,
									nextUp.user.displayAvatarURL()
								)
						);
						return second(channel, playerOne, playerTwo, message);
					} else if (chance[attackChance] === 'no') {
						playerOneData.battleTurn = false;
						await collector.stop();
						await channel.send(
							new MessageEmbed()
								.setDescription(
									`${nowBattling} が **${
										attacks[i]
									}** を使用した！が、よけられた \n${nextUp}の残体力: \`${
										playerTwoData.battleHealth
									}\` HP`
								)
								.setColor('RED')
								.setAuthor(
									`Attacker: ${nowBattling.displayName}`,
									nowBattling.user.displayAvatarURL()
								)
								.setFooter(
									`Next Attacker: ${nextUp.displayName}`,
									nextUp.user.displayAvatarURL()
								)
						);
						await second(channel, playerOne, playerTwo, message);
					}
				}
			}

			var x;
			for (x = 0; x < heals.length; x++) {
				if (msg.content.toLowerCase() === heals[x]) {
					let healAmount =
						Math.floor(Math.random() * (settings.healMax - settings.healMin)) +
						settings.healMin;
					let healChance = Math.floor(Math.random() * chance.length);
					if (chance[healChance] === 'yes') {
						playerOneData.battleHealth += healAmount;
						playerOneData.battleTurn = false;
						await collector.stop();
						await channel.send(
							new MessageEmbed()
								.setDescription(
									`${nowBattling} が **${
										heals[x]
									}** を使用した！\`${healAmount}\` HP回復した！, 敵の残体力:\`${
										playerOneData.battleHealth
									}\` HP!`
								)
								.setColor('GREEN')
								.setAuthor(
									`Healer: ${nowBattling.displayName}`,
									nowBattling.user.displayAvatarURL()
								)
								.setFooter(
									`Next Attacker: ${nextUp.displayName}`,
									nextUp.user.displayAvatarURL()
								)
						);
						return second(channel, playerOne, playerTwo, message);
					} else if (chance[healChance] === 'no') {
						playerOneData.battleTurn = false;
						await collector.stop();
						await channel.send(
							new MessageEmbed()
								.setDescription(
									`${nowBattling} が **${
										heals[x]
									}**を使った！が、効果はいまひとつのようだ... \n敵の残体力:\`${
										playerTwoData.battleHealth
									}\` HP!`
								)
								.setColor('GREEN')
								.setAuthor(
									`Healer: ${nowBattling.displayName}`,
									nowBattling.user.displayAvatarURL()
								)
								.setFooter(
									`Next Attacker: ${nextUp.displayName}`,
									nextUp.user.displayAvatarURL()
								)
						);
						return second(channel, playerOne, playerTwo, message);
					}
				}
			}
		});
	}

async function selfsecond(channel, playerOne, playerBot, message) {
		let nowBattling = channel.guild.members.cache.get(playerBot);
		let nextUp = channel.guild.members.cache.get(playerOne);
		let data = playerBotData;

		let filter = yeet => yeet.author.id === nowBattling.id;
		let collector = channel.createMessageCollector(filter);
		if (playerBotData.battleTurn === true) return;
		playerBotData.battleTurn = true;

		if (playerBotData.battleHealth <= 0) {
			return selfend(channel, playerOne, playerBot, playerOne);
		}
		let botselect = botatack[Math.floor(Math.random() * botatack.length)];
		setTimeout(() => {
      message.channel.send(botselect)
		}, 1000);

		collector.on('collect', async msg => {
			if (
				msg.content.toLowerCase() === '--end' 
			) {
				let winner;
				if (playerOneData.battleHealth >= playerTwoData.battleHealth)
					winner = playerOne;
				if (playerOneData.battleHealth < playerTwoData.battleHealth)
					winner = playerBot;
				await collector.stop();
				return selfend(channel, playerOne, playerBot, winner);
			}

			var i;
			for (i = 0; i < attacks.length; i++) {
				if (msg.content.toLowerCase() === attacks[i]) {
					let attackAmount =
						Math.floor(
							Math.random() * (settings.attackMax - settings.attackMin)
						) + settings.attackMin;
					let attackChance = Math.floor(Math.random() * chance.length);
					if (chance[attackChance] === 'yes') {
						playerOneData.battleHealth -= attackAmount;
						playerBotData.battleTurn = false;
						await collector.stop();
						await channel.send(
							new MessageEmbed()
								.setDescription(
									`${nowBattling} が **${
										attacks[i]
									}** を使った！ \`${attackAmount}\`ダメージを与えた\n ${nextUp}の残体力:\`${
										playerOneData.battleHealth
									}\` HP`
								)
								.setColor('RED')
								.setAuthor(
									`Attacker: ${nowBattling.displayName}`,
									nowBattling.user.displayAvatarURL()
								)
								.setFooter(
									`Next Attacker: ${nextUp.displayName}`,
									nextUp.user.displayAvatarURL()
								)
						);
						return selffirst(channel, playerOne, playerBot, message);
					} else if (chance[attackChance] === 'no') {
						playerBotData.battleTurn = false;
						await collector.stop();
						await channel.send(
							new MessageEmbed()
								.setDescription(
									`${nowBattling}が**${
										attacks[i]
									}** を使った！が、避けられた！！\n${nextUp}の残体力:\`${
										playerBotData.battleHealth
									}\` HP`
								)
								.setColor('RED')
								.setAuthor(
									`Attacker: ${nowBattling.displayName}`,
									nowBattling.user.displayAvatarURL()
								)
								.setFooter(
									`Next Attacker: ${nextUp.displayName}`,
									nextUp.user.displayAvatarURL()
								)
						);
						return selffirst(channel, playerOne, playerBot, message);
					}
				}
			}

			var x;
			for (x = 0; x < heals.length; x++) {
				if (msg.content.toLowerCase() === heals[x]) {
					let healAmount =
						Math.floor(Math.random() * (settings.healMax - settings.healMin)) +
						settings.healMin;
					let healChance = Math.floor(Math.random() * chance.length);
					if (chance[healChance] === 'yes') {
						playerBotData.battleHealth += healAmount;
						playerBotData.battleTurn = false;
						await collector.stop();
						await channel.send(
							new MessageEmbed()
								.setDescription(
									`${nowBattling} が **${
										heals[x]
									}** を使った！ \`${healAmount}\` HP回復した \n残体力: \`${
										playerBotData.battleHealth
									}\` HP!`
								)
								.setColor('GREEN')
								.setAuthor(
									`Healer: ${nowBattling.displayName}`,
									nowBattling.user.displayAvatarURL()
								)
								.setFooter(
									`Next Attacker: ${nextUp.displayName}`,
									nextUp.user.displayAvatarURL()
								)
						);
						return selffirst(channel, playerOne, playerBot, message);
					} else if (chance[healChance] === 'no') {
						playerTwoData.battleTurn = false;
						await collector.stop();
						await channel.send(
							new MessageEmbed()
								.setDescription(
									`${nowBattling} が **${
										heals[x]
									}** を使った！が、効果はいまひとつのようだ, \n残体力: \`${
										playerBotData.battleHealth
									}\` HP!`
								)
								.setColor('GREEN')
								.setAuthor(
									`Healer: ${nowBattling.displayName}`,
									nowBattling.user.displayAvatarURL()
								)
								.setFooter(
									`Next Attacker: ${nextUp.displayName}`,
									nextUp.user.displayAvatarURL()
								)
						);
						return selffirst(channel, playerOne, playerBot, message);
					}
				}
			}
		});
	}

	async function second(channel, playerOne, playerTwo, message) {
		let nowBattling = channel.guild.members.cache.get(playerTwo);
		let nextUp = channel.guild.members.cache.get(playerOne);
		let data = playerTwoData;

		let filter = yeet => yeet.author.id === nowBattling.id;
		let collector = channel.createMessageCollector(filter);
		if (playerTwoData.battleTurn === true) return;
		playerTwoData.battleTurn = true;

		if (playerTwoData.battleHealth <= 0) {
			return end(channel, playerOne, playerTwo, playerOne);
		}

		collector.on('collect', async msg => {
			if (
				msg.content.toLowerCase() === '--end'
			) {
				let winner;
				if (playerOneData.battleHealth >= playerTwoData.battleHealth)
					winner = playerOne;
				if (playerOneData.battleHealth < playerTwoData.battleHealth)
					winner = playerTwo;
				await collector.stop();
				return end(channel, playerOne, playerTwo, winner);
			}

			var i;
			for (i = 0; i < attacks.length; i++) {
				if (msg.content.toLowerCase() === attacks[i]) {
					let attackAmount =
						Math.floor(
							Math.random() * (settings.attackMax - settings.attackMin)
						) + settings.attackMin;
					let attackChance = Math.floor(Math.random() * chance.length);
					if (chance[attackChance] === 'yes') {
						playerOneData.battleHealth -= attackAmount;
						playerTwoData.battleTurn = false;
						await collector.stop();
						await channel.send(
							new MessageEmbed()
								.setDescription(
									`${nowBattling} が **${
										attacks[i]
									}** を使った！ \`${attackAmount}\`ダメージを与えた\n ${nextUp}の残体力:\`${
										playerOneData.battleHealth
									}\` HP`
								)
								.setColor('RED')
								.setAuthor(
									`Attacker: ${nowBattling.displayName}`,
									nowBattling.user.displayAvatarURL()
								)
								.setFooter(
									`Next Attacker: ${nextUp.displayName}`,
									nextUp.user.displayAvatarURL()
								)
						);
						return first(channel, playerOne, playerTwo, message);
					} else if (chance[attackChance] === 'no') {
						playerTwoData.battleTurn = false;
						await collector.stop();
						await channel.send(
							new MessageEmbed()
								.setDescription(
									`${nowBattling}が**${
										attacks[i]
									}** を使った！が、避けられた！！\n${nextUp}の残体力:\`${
										playerTwoData.battleHealth
									}\` HP`
								)
								.setColor('RED')
								.setAuthor(
									`Attacker: ${nowBattling.displayName}`,
									nowBattling.user.displayAvatarURL()
								)
								.setFooter(
									`Next Attacker: ${nextUp.displayName}`,
									nextUp.user.displayAvatarURL()
								)
						);
						return first(channel, playerOne, playerTwo, message);
					}
				}
			}

			var x;
			for (x = 0; x < heals.length; x++) {
				if (msg.content.toLowerCase() === heals[x]) {
					let healAmount =
						Math.floor(Math.random() * (settings.healMax - settings.healMin)) +
						settings.healMin;
					let healChance = Math.floor(Math.random() * chance.length);
					if (chance[healChance] === 'yes') {
						playerTwoData.battleHealth += healAmount;
						playerTwoData.battleTurn = false;
						await collector.stop();
						await channel.send(
							new MessageEmbed()
								.setDescription(
									`${nowBattling} が **${
										heals[x]
									}** を使った！ \`${healAmount}\` HP回復した \n敵の残体力: \`${
										playerTwoData.battleHealth
									}\` HP!`
								)
								.setColor('GREEN')
								.setAuthor(
									`Healer: ${nowBattling.displayName}`,
									nowBattling.user.displayAvatarURL()
								)
								.setFooter(
									`Next Attacker: ${nextUp.displayName}`,
									nextUp.user.displayAvatarURL()
								)
						);
						return first(channel, playerOne, playerTwo, message);
					} else if (chance[healChance] === 'no') {
						playerTwoData.battleTurn = false;
						await collector.stop();
						await channel.send(
							new MessageEmbed()
								.setDescription(
									`${nowBattling} が **${
										heals[x]
									}** を使った！が、効果はいまひとつのようだ, \n敵の残体力 \`${
										playerTwoData.battleHealth
									}\` HP!`
								)
								.setColor('GREEN')
								.setAuthor(
									`Healer: ${nowBattling.displayName}`,
									nowBattling.user.displayAvatarURL()
								)
								.setFooter(
									`Next Attacker: ${nextUp.displayName}`,
									nextUp.user.displayAvatarURL()
								)
						);
						return first(channel, playerOne, playerTwo, message);
					}
				}
			}
		});
	}
	
		async function selfend(channel, playerOne, playerBot, winner) {
		let wonData;
		let won = channel.guild.members.cache.get(winner);
		if (winner === playerOne) wonData = playerOneData;
		if (winner === playerBot) wonData = playerBotData;
		setTimeout(() => {
			return channel.send(
				new MessageEmbed()
					.setTitle('Congratgulations!')
					.setDescription(
						`${won} の勝利！\n体力: \`${wonData.battleHealth}\` HP!`
					)
					.setColor('GREEN')
					.setFooter(won.displayName, won.user.displayAvatarURL())
			);
		}, 1500);
	}

	async function end(channel, playerOne, playerTwo, winner) {
		let wonData;
		let won = channel.guild.members.cache.get(winner);
		if (winner === playerOne) wonData = playerOneData;
		if (winner === playerTwo) wonData = playerTwoData;
		setTimeout(() => {
			return channel.send(
				new MessageEmbed()
					.setTitle('Congratgulations!')
					.setDescription(
						`${won} の勝利！\n体力: \`${wonData.battleHealth}\` HP!`
					)
					.setColor('GREEN')
					.setFooter(won.displayName, won.user.displayAvatarURL())
			);
		}, 1500);
	}
};