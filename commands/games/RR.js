const Discord = require('discord.js');

class HorsengelRoulette {
	constructor(message, player1, player2, prefix) {
		this.bot = message.guild.me;
		this.channel = message.channel;
		this.guild = message.guild;
		this.players = [player1, player2];
		this.prefix = "ps!";
		this.revolver = [];
		this.revolverString = '[o][o][o][o][o][o]'
	}

	load(magazine, bullets) {
		for (let chamber = 0; chamber < magazine; chamber++) {
			this.revolver[chamber] = 0;
		}

		const addBullets = (revolver) => {
			let chamber;
			
			if (this.players[1].id === this.bot.id) { 
				chamber = Math.floor(Math.random() * (magazine / 2)) * 2;
			} else {
				chamber = Math.floor(Math.random() * (magazine));
			}

			if (revolver[chamber] === 0) {
				revolver[chamber] = 1;
			} else {
				addBullets(revolver);
			}
			
			return revolver;
		}

		for (let b = 0; b < bullets; b++) {
			this.revolver = addBullets(this.revolver);
		}
		console.log(this.revolver);
	}

	async start() {
		if (this.players[1].id === this.players[0].id) {
				return this.channel.send('error(対戦相手を指定してください)');
		}

		this.channel.send(`${this.players[1]}!あなたは${this.players[0]} から決闘を申し込まれました！${this.prefix}yes と送信すれば、対決を受けることができます(30秒)`);

		let answer = true;


		if (this.players[1].user.bot) {
			if (this.players[1].id === this.bot.id) {
				await this.sleep();
				const mood = Math.floor(Math.random() * 5);
				if (mood === 5) {
          this.channel.send("え、私がやるの？(イヤだな)")
				}
				this.channel.send(`${this.prefix}yes`);
			} else {
				return this.channel.send(`${this.players[1]}とプレイするのは難しいよ！`)
			}
		} else {
		  const replyCollector = new Discord.MessageCollector(message.channel, m => m.author.id == message.author.id, { time: 30000 });
		replyCollector.on((msg) => {
				if (msg.author.id === this.players[1].id && msg.content === `ps!yes`) {
					reply(func)
				}else{
			return this.channel.send(`${this.players[1]}は遠くへと逃げてしまった`);
			}
		})
		return this.game();
	}
 function reply(func) {
		let player = this.players[0];

		for (let chamber = 0; chamber < this.revolver.length; chamber++) {
			this.channel.send(`${player}の番です。 ${this.prefix}pan で発砲します(30秒)`);

			let answer = true;
			if (player.id === this.bot.id) {
		  this.sleep();
				this.channel.send(`${this.prefix}pan`);
			} else {
			  const answerCollector = new Discord.MessageCollector(message.channel, m => m.author.id == message.author.id, { time: 30000 });
          answerCollector.on("collect",msg => {
					if (msg.author.id === player.id && msg.content === `ps!pan`) {
							pan(func)
						}else{
						return this.channel.send(`${player}は遠くへと逃げてしまった`);
					}
			})
		}


function pan(func){
			if (this.revolver[chamber] === 0) {
				this.channel.send({embed: this.embedRound(chamber, `${player}が発砲した！弾は入ってなかったようだ。`)});

			} else {

				if (player.user.id === this.guild.ownerID) {
					return this.channel.send({embed: this.embedRound(chamber, ` ${player}が発砲した！(もうおわかりですね？)`, true)});

				} else if (player.user.id === this.bot.id) {
					return this.channel.send('.........(........)');

				} else {
					this.channel.send({embed: this.embedRound(chamber, `${player}が発砲した！(もうおわかりですね？)`, true)});
					const description = '';
					return;
				}
			}
}
	

			if (player.id  === this.players[0].id) {
				player = this.players[1];
			} else {
				player = this.players[0];
			}
		}
	}


	embedRound(round, description, gameOver = false) {
		round++;
		let index = round * 3 - 2; 

		const replaceAt = (str, char, i) => {
			if (i > str.length - 1 || str.charAt(i) === char) {
				return str;
			}
			return str.substr(0, i) + char + str.substr(i + 1);
		};

		if (round > 0) {
			if (gameOver) {
				this.revolverString = replaceAt(this.revolverString, 'X', index);
			} else {
				let player;
				if ((round & 1) === 0) {
					player = 2;
				} else {
					player = 1;
				}
				this.revolverString = replaceAt(this.revolverString, player, index);
			}
		}

		return new Discord.MessageEmbed()
			.setTitle('russian roulette')
			.setColor('RANDOM')
			.setDescription(description)
			.addField('Player 1', this.players[0], true)
			.addField('Player 2', this.players[1], true)
			.addField('Round', round, true)
			.addField('Revolver', this.revolverString, true);
	}
	
}

module.exports = HorsengelRoulette;