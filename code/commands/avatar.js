module.exports = {
    name: 'avatar',
    description: 'Display a user\'s avatar.',
    args: false,
    usage: '<user>',
    guildOnly: true,
    cooldown: 30,
    aliases: ['icon', 'pfp'],
    execute(message, args) {
        if (!message.mentions.users.size) {
            return message.channel.send(`Your avavtar: <${message.author.displayAvatarURL({ format: "png", dynamic: true })}>`);
        }

        const avatarList = message.mentions.users.map(user => {
            return `${user.username}'s avatar: <${user.displayAvatarURL({ format: "png", dynamic: true})}>`;
        });

        message.channel.send(avatarList);
    },
};
