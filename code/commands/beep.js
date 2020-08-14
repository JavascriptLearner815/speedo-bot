module.exports = {
    name: 'beep',
    description: 'Beep!',
    args: false,
    usage: false,
    guildOnly: false,
    cooldown: 60,
    aliases: ['boop', 'beepboop'],
    execute(message, args) {
        message.channel.send('Boop.');
    },
};
