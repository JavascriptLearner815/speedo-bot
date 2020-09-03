const fetch = require('node-fetch');

module.exports = {
    name: 'cat',
    description: 'Displays a random cat.',
    args: false,
    usage: false,
    guildOnly: false,
    cooldown: 10,
    aliases: ['kitten', 'kitty', 'meow'],
    async execute(message, args) {
        const { file } = await fetch('https://aws.random.cat/meow').then(response => response.json());

        message.channel.send(file);
    },
};
