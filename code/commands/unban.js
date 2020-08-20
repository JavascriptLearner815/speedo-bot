const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'unban',
    description: 'Unban a user by their ID.',
    args: true,
    usage: '<id>',
    guildOnly: true,
    cooldown: 5,
    aliases: ['unperm'],
    execute(message, args) {
        try {
            const guild = message.guild;
            const userID = args[0];
            const reason = args.slice(1).join(' ');
            const author = guild.member(message.author);
            const bans = guild.fetchBans();
    
            if (!author.hasPermission('BAN_MEMBERS')) {
                return message.channel.send(`${author.user}, you don't have permission to use this command.`);
            }
            
            if (!guild.me.hasPermission('BAN_MEMBERS')) {
                return message.channel.send('Please give me the permissions to ban (The ban permission also lets me unban).');
            }
    
            if (!reason) {
                return message.channel.send('Please specify a reason.');
            }
    
            const userBanned = bans.find(user => user.id === reason);
    
            if (!userBanned) {
                return message.channel.send('User does not exist or is not banned.');
            }
    
            message.guild.members.unban(userID);
    
            const unbanEmbed = new MessageEmbed()
                .setTitle('User Unbanned')
                .addFields(
                    { name: 'Moderator', value: author.user },
                    { name: 'User ID', value: userID },
                    { name: 'Reason', value: reason },
                )
                .setURL('https://github.com/JavascriptLearner815/speedo-bot')
                .setFooter('Bot created by SpeedoThreeSixty#3179', guild.me.user.displayAvatarURL({ format: "png", dynamic: true }));
    
            message.channel.send(unbanEmbed);
        } catch (error) {
            console.error('Unban command failed', error);
        }
    },
};
