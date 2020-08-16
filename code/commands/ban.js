const { permissionFlags, speedoID } = require('../config.json');

module.exports = {
    name: 'ban',
    description: 'Bans a user from the server.',
    args: true,
    usage: '<user> <reason>',
    guildOnly: true,
    cooldown: 20,
    aliases: ['removeMemberForever'],
    execute(message, args) {
        const user = message.mentions.users.first();
        const authorUser = message.author;
        const authorMember = message.guild.member(authorUser);
        const reason = args.slice(1).join(' ');

        if (user.id === message.guild.ownerID) {
            return message.channel.send('You cannot ban the owner of the guild.');
        }
        
        if (user.id === speedoID) {
            return message.channel.send('How dare you ban my creator');
        }

        if (user.bot) {
            return message.channel.send(`You can't ban a bot, right-click them and click 'Kick ${user}' instead.`);
        }

        if (!reason) {
            return message.channel.send('You must specify a reason.');
        }

        if (!message.guild.me.hasPermission(permissionFlags[3])) {
            return message.channel.send('Please give me the permissions to ban.');
        }

        if (authorMember.hasPermission(permissionFlags[3])) {
            try {
                message.guild.members.ban(user);
            } catch (error) {
                console.error(`Could not ban ${user}`, error);
                return message.channel.send(`I couldn't ban ${user} because ${error}.`);
            } finally {
                user.send(`You were banned by ${authorUser} for ${reason}`);
                return message.channel.send(`${user} successfully banned!`);
            }
        } else {
            return message.channel.send(`I'm sorry ${message.author}, but you do not have permission to use this command.`);
        }
    },
};
