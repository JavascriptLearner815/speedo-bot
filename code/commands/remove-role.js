const { prefix } = require('../config.json');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'remove-role',
    description: 'Removes a member\'s role.',
    args: true,
    usage: '<user> <role> <reason>',
    guildOnly: true,
    cooldown: 20,
    aliases: ['rm-role'],
    execute(message, args) {
        const author = message.guild.member(message.author);
        const member = message.mentions.members.first() || args[0];
        const role = member.roles.cache.find(role => role.name === args[1]);
        const reason = args.slice(2).join(/ +/);

        if (!role || !reason) {
            return message.channel.send(`Use the command like this: ${prefix}${name} ${usage}`);
        }

        if (!author.hasPermission('MANAGE_ROLES')) {
            return message.channel.send(`I'm sorry ${author.user}, but you don't have permission to use this command.`);
        }

        if (!message.guild.me.hasPermission('MANAGE_ROLES')) {
            return message.channel.send('Please give me the permission to manage roles.');
        }

        member.roles.remove(role, reason);

        const embed = new MessageEmbed()
            .setAuthor(message.guild.me.user.username)
            .setTitle('Role removed')
            .addFields(
                { name: 'Moderator', value: author.user },
                { name: 'User', value: member.user },
                { name: 'Role', value: args[1] },
                { name: 'Reason', value: reason },
            );

        embed.setTimestamp(`${embed.createdAt}`);

        const dmMessage = `Your ${args[1]} role was removed in ${message.guild.name} because ${reason} by ${author.user}`;

        try {
            message.channel.send(embed);
        } catch (err) {
            console.error('Could not send MessageEmbed:', err);
        }
        try {
            member.user.send(dmMessage);
        } catch (e) {
            console.warn(`Could not send DM to ${member.user}`, e);
        }
    },
};
