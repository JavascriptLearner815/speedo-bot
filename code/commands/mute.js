const { permissionFlags } = require('../config.json');

const Discord = require('discord.js');

module.exports = {
    name: 'mute',
    description: 'Mute a member in the server.',
    args: true,
    usage: '<user> <reason>',
    guildOnly: true,
    cooldown: 10,
    aliases: ['noTalk', 'm'],
    execute(message, args) {
        const member = message.mentions.members.first();
        const user = member.user;
        const authorUser = message.author;
        const authorMember = message.guild.member(authorUser);
        const reason = args.slice(1).join(' ');

        if (user.id === message.guild.ownerID) {
            return message.channel.send('You can\'t mute the owner of the guild.');
        }

        if (user.bot) {
            return message.channel.send(`You can't mute a bot, right-click them and click 'Kick ${user}' instead.`);
        }

        if (!reason) {
            return message.channel.send('You need to specify a reason.');
        }

        if (!message.guild.me.hasPermission(permissionFlags[28])) {
            return message.channel.send('Please give me the permissions to manage roles (the mute command works with a Muted role).');
        }

        if (member.roles.cache.some(role => role.id === globalThis.mutedRole)) return message.channel.send('You can\'t mute someone that is already muted!');
        
        if (authorMember.hasPermission(permissionFlags[2]) && authorMember.hasPermission(permissionFlags[3])) {
            if (!globalThis.mutedRole) {
                let role = message.guild.roles.create({
                    name: 'Muted',
                    permissions: [],
                    hoisted: false,
                    mentionable: false,
                    color: '#808080',
                });

                globalThis.mutedRole = role.id;
            }

            try {
                user.send(`You were muted by ${authorUser} for ${reason} in ${message.guild.name}.`);
            } catch (error) {
                console.error(`Couldn't send mute DM to ${user}`, error);
                try {
                    const muteEmbed = new Discord.MessageEmbed()
                        .setTitle(`This embed is for ${user}!`)
                        .setAuthor(`${message.guild.me.user.username}`)
                        .setTimestamp(`${message.createdAt.toLocaleString()}`)
                        .setDescription(`${user} was muted.`)
                        .addFields(
                            { name: 'Moderator', value: authorUser },
                            { name: 'Reason', value: reason },
                        )
                        .setFooter('Bot created by SpeedoThreeSixty#3179');

                    message.channel.send(muteEmbed);
                } catch (e) {
                    console.error(`Could not send mute embed to ${user.username}`, error);
                    return message.channel.send('I failed to inform this user about the mute, please tell them yourself!');
                }
            }

            member.roles.add(globalThis.mutedRole, reason);
            
            return message.channel.send(`Successfully muted ${user}. Use 'speedo unmute ${user} <reason>' to unmute them.`);

        } else {
            return message.reply('you don\'t have permissions to kick or ban, so you can\'t mute!');
        }
    },
};
