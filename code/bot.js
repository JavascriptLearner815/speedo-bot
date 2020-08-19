const { prefix, token, secret, botID, speedoID, permissionFlags } = require('./config.json');
const { TextDecoder, TextEncoder, callbackify, debuglog, deprecate, format, formatWithOptions, inherits, inspect, isArray, isBoolean, isBuffer, isDate, isDeepStrictEqual, isError, isFunction, isNull, isNullOrUndefined, isNumber, isObject, isPrimitive, isRegExp, isString, isSymbol, isUndefined, log, promisify, types,  } = require('util');

const fs = require('fs');

const Discord = require('discord.js');
const client = new Discord.Client();

const cooldowns = new Discord.Collection();

client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

function supportReply(msg) {
    if (msg.guild.id == '744604057678774392') {
        if (msg.content.includes('mute command')) {
            return msg.channel.send('The mute command was removed because it had a very big bug. It would create a role, only call it "new role", and not give it, or call it "Muted", and not give it.');
        } else if (msg.content.includes('level') || msg.content.includes('xp')) {
            return msg.channel.send('We will add a leveling feature sometime soon.');
        } else if (msg.content.includes('git')) {
            return msg.channel.send('https://github.com/JavascriptLearner815/speedo-bot');
        }
    }
}

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);

    client.commands.set(command.name, command);
}

client.once('ready', () => {
    console.log('Ready!');
});

client.on('message', message => {
    if (message.author.bot) return;

    supportReply(message);

    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName)
        || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;

    if (command.guildOnly && message.channel.type === 'dm') {
        return message.reply('I can\'t execute that command inside DMs!');
    }

    if (command.args && !args.length) {
        let reply = `You didn't provide any arguments, ${message.author}!`;

        if (command.usage) {
            reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
        }

        return message.channel.send(reply);
    }

    if (message.author.id !== speedoID) {
        if (!cooldowns.has(command.name)) {
            cooldowns.set(command.name, new Discord.Collection());
        }
    
        const now = Date.now();
        const timestamps = cooldowns.get(command.name);
        const cooldownAmount = (command.cooldown || 3) * 1000;
    
        if (timestamps.has(message.author.id)) {
            const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
    
            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;
                return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
            }
        }
    
        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    }
    
    if (command === 'stats') {
        return client.shard.fetchClientValues('guilds.cache.size')
	        .then(results => {
		        console.log(`${results.reduce((acc, guildCount) => acc + guildCount, 0)} total guilds`);
	        })
	        .catch(console.error);
    }

    try {
        command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply('there was an error trying to execute that command!');
    }
});

client.on('shardError', error => {
    console.error('A websocket connection encountered an error:', error);
});

process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
});

client.login(token);
