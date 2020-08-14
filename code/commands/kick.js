module.exports = {
    name: 'kick',
    description: 'Kick a user from the server.',
    args: true,
    usage: '<user>',
    guildOnly: true,
    cooldown: 15,
    aliases: ['removeMember'],
    execute(message, args) {
        const taggedUser = message.mentions.users.first();

        if (taggedUser.bot) {
            return message.reply('I can\'t kick my own bot friends! :smile:');
        }

        message.channel.send(`You wanted to kick: ${taggedUser.username}`);
    },
};
