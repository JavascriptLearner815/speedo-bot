module.exports = {
    name: 'user-info',
    description: 'Basic info about the user.',
    args: false,
    usage: false,
    guildOnly: false,
    cooldown: 35,
    aliases: ['user'],
    execute(message, args) {
        message.channel.send(`Your username: ${message.author.username}\nYour ID: ${message.author.id}`);
    },
};
