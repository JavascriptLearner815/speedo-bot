const { prefix } = require('../config.json');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'role',
    description: 'Gives a member a role.',
    args: true,
    usage: '<user> <role> <reason>',
    guildOnly: true,
    cooldown: 20,
    aliases: ['give', 'give-role', 'add-role'],
    execute(message, args) {
        const author = message.guild.member(message.author);
        const member = message.mentions.members.first() || args[0];
        const role = message.guild.roles.cache.find(role => role.name === args[1]);
        const reason = args.slice(2).join(' ');

        if (!role || !reason) {
            return message.channel.send(`Use the command like this: ${prefix}${name} ${usage}`);
        }

        if (!author.hasPermission('MANAGE_ROLES')) {
            return message.channel.send(`I'm sorry ${author.user}, but you don't have permission to use this command.`);
        }

        if (!message.guild.me.hasPermission('MANAGE_ROLES')) {
            return message.channel.send('Please give me the permissions to manage roles.');
        }

        member.roles.add(role);

        const embed = new MessageEmbed()
            .setAuthor(message.guild.me.user.username)
            .setTitle('Role given')
            .addFields(
                { name: 'Moderator', value: author.user },
                { name: 'User', value: member.user },
                { name: 'Role', value: args[1] },
                { name: 'Reason', value: reason },
            );
            
        embed.setTimestamp(`${embed.createdAt}`);

        const dmMessage = `You were given the role ${args[1]} in ${message.guild.name} because ${reason}.`;

        try {
            member.user.send(dmMessage);
        } catch (err) {
            console.warn(err);
            try {
                message.channel.send(embed);
            } catch (e) {
                console.error(e);
            }
        }
    },
};
