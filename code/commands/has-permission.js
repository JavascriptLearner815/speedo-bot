module.exports = {
    name: 'has-permission',
    description: 'Check a user for a permission.',
    args: true,
    usage: '<user> <permission>',
    guildOnly: true,
    cooldown: 20,
    aliases: ['check-permission', 'check'],
    execute(message, args) {
        if (args.length < 2) {
            let reply = `You didn't provide enough arguments, ${message.author}!`;

            if (this.usage) {
                reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
            }

            return message.channel.send(reply);
        }

        const permissionFlags = [
            'ADMINISTRATOR',
            'CREATE_INSTANT_INVITE',
            'KICK_MEMBERS',
            'BAN_MEMBERS',
            'MANAGE_CHANNELS',
            'MANAGE_GUILD',
            'ADD_REACTIONS',
            'VIEW_AUDIT_LOG',
            'PRIORITY_SPEAKER',
            'STREAM',
            'VIEW_CHANNEL',
            'SEND_MESSAGES',
            'SEND_TTS_MESSAGES',
            'MANAGE_MESSAGES',
            'EMBED_LINKS',
            'ATTACH_FILES',
            'READ_MESSAGE_HISTORY',
            'MENTION_EVERYONE',
            'USE_EXTERNAL_EMOJIS',
            'VIEW_GUILD_INSIGHTS',
            'CONNECT',
            'SPEAK',
            'MUTE_MEMBERS',
            'DEAFEN_MEMBERS',
            'MOVE_MEMBERS',
            'USE_VAD',
            'CHANGE_NICKNAME',
            'MANAGE_NICKNAMES',
            'MANAGE_ROLES',
            'MANAGE_WEBHOOKS',
            'MANAGE_EMOJIS'
        ];
        const member = message.mentions.users.first();
        const permission = args[1];

        for (const permissionFlag of permissionFlags) {
            if (permission === permissionFlag) {
                if (member.hasPermission(permission)) {
                    message.reply(`${member} does have ${permission}.`);
                    break;
                } else {
                    message.reply(`${member} does not have ${permission}.`);
                    break;
                }
            }
        }
    },
};
