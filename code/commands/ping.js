module.exports = {
    name: 'ping',
    description: 'Ping!',
    args: false,
    usage: false,
    guildOnly: false,
    cooldown: 60,
    aliases: ['pong', 'pingpong'],
    execute(message, args) {
        message.channel.send('Pong.');
    },
};
