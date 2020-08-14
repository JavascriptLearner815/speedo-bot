module.exports = {
    name: 'args-info', 
    description: 'Displays arguments, with a few easter eggs.',
    args: true,
    usage: '<arguments>',
    guildOnly: false,
    cooldown: 30,
    aliases: ['argumets-info', 'arguments', 'args'],
    execute(message, args) {
        if (args[0] === 'foo') {
            return message.channel.send('bar');
        } else if (args[0] === 'speedo') {
            return message.channel.send('360');
        }

        message.channel.send(`Arguments: ${args}`);
    },
};
