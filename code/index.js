const { prefix, token, secret, botID, speedoID } = require('./config.json');
const { TextDecoder, TextEncoder, callbackify, debuglog, deprecate, format, formatWithOptions, inherits, inspect, isArray, isBoolean, isBuffer, isDate, isDeepStrictEqual, isError, isFunction, isNull, isNullOrUndefined, isNumber, isObject, isPrimitive, isRegExp, isString, isSymbol, isUndefined, log, promisify, types,  } = require('util');

const fs = require('fs');

const Discord = require('discord.js');
const client = new Discord.Client();

const cooldowns = new Discord.Collection();

client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);

    client.commands.set(command.name, command);
}

client.once('ready', () => {
    console.log('Ready!');
});

client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

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

client.on('shardReady', () => {
    console.log('The websocket is ready.');
});

client.on('shardDisconnect', () => {
    console.log('The websocket has disconnected.');
});

client.on('shardReconnecting', () => {
    console.log('The websocket is reconnecting...');
});

client.on('shardResume', () => {
    console.log('The websocket is resuming.');
});

client.on('guildUnavailable', (guild) => {
    console.warn(`The guild ${guild} is unavailable.`);
});

client.on('presenceUpdate', (oldPresence, newPresence) => {
    console.log(`${oldPresence.user || newPresence.user} was updated from ${oldPresence.status} to ${newPresence.status}`);
    if (isNullOrUndefined(oldPresence.user)) {
        console.warn(`oldPresence.user is invalid.`);
    }
    if (isNullOrUndefined(newPresence.user)) {
        console.warn(`newPresence.user is invalid.`);
    }
    if (isNullOrUndefined(oldPresence.user) && isNullOrUndefined(newPresence.user)) {
        console.warn(`oldPresence.user AND newPresence.user are invalid, something's probably wrong.`);
    }
});

client.on('typingStart', (channel, user) => {
    console.log(`${user} is typing in ${channel}...`);
});

process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
});

client.login(token);
