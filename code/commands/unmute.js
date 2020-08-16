const { permissionFlags } = require('../config.json');

module.exports = {
    name: 'unmute',
    description: 'Unmutes a user in the server.',
    args: true,
    usage: '<user> <reason>',
    guildOnly: true,
    cooldown: 5,
    aliases: ['allowTalk', 'unm'],
    execute(message, args) {
        const member = message.mentions.members.first();
        const user = member.user;
        const authorUser = message.author;
        const authorMember = message.guild.member(authorUser);
        const reason = args.slice(1).join(' ');

        let muteCheck = false;

        if (user.id === message.guild.ownerID) {
            return message.channel.send('You cannot unmute the owner because they can\'t be muted!');
        }

        if (user.bot) {
            return message.channel.send(`You can't unmute a bot, right-click them and click 'Kick ${user}' instead.`);
        }

        if (!reason) {
            return message.channel.send('Please specify a reason.');
        }

        if (!message.guild.me.hasPermission(permissionFlags[28])) {
            return message.channel.send('Please give me the permissions to manage roles (the unmute command works with a Muted role).');
        }

        if (member.roles.cache.some(role => role.id === globalThis.mutedRole)) muteCheck = true;

        if (muteCheck === false) {
            return message.channel.send('You can\'t unmute someone that isn\'t muted!');
        }

        if (authorMember.hasPermission(permissionFlags[2]) && authorMember.hasPermission(permissionFlags[3])) {
            try {
                member.roles.remove('Muted', reason);
                user.send(`You were unmuted by ${authorUser} for ${reason} in ${message.guild.name}.`);
            } catch (err) {
                console.error(err);
            } finally {
                return message.channel.send(`${user} successfully unmuted!`);
            }
        } else {
            return message.channel.send('You need to be able to kick and ban members in order to mute!');
        }
    },
};
