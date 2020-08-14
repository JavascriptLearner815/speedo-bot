module.exports = {
    name: 'server',
    description: 'Basic server info.',
    args: false,
    usage: false,
    guildOnly: true,
    cooldown: 45,
    aliases: ['server-info', 'guild', 'guild-info'],
    execute(message, args) {
        message.channel.send(`Name: ${message.guild.name}\nTotal members: ${message.guild.memberCount}\nCreated: ${message.guild.createdAt}\nLocation: ${message.guild.region}`);
    },
};
