const { permissionFlags } = require('../config.json');

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

        const member = message.mentions.members.first();
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
