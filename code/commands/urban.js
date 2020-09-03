const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
const querystring = require('querystring');
const trim = (str, max) => ((str.length > max) ? `${str.slice(0, max - 3)}...` : str);

module.exports = {
    name: 'urban',
    description: 'Get a definition from the urban dictionary.',
    args: true,
    usage: '<term>',
    guildOnly: false,
    cooldown: 15,
    aliases: ['urb', 'urban-dic', 'urb-dic', 'urban-dictionary', 'urb-dictionary'],
    async execute(message, args) {
        const query = querystring.stringify({ term: args.join(' ') });

        const { list } = await fetch(`https://api.urbandictionary.com/v0/define?${query}`).then(response => response.json());

        if (!list.length) {
            const embed = new MessageEmbed()
                .setColor('#EFFF00')
                .setTitle('No Results')
                .setDescription(`No results found for **${args.join(' ')}**.`);

            return message.channel.send(embed);
        }

        const [ answer ] = list;

        const embed = new MessageEmbed()
            .setColor('#EFFF00')
            .setTitle(answer.word)
            .setURL(answer.permalink)
            .addFields(
                { name: 'Definition', value: trim(answer.definition, 1024) },
                { name: 'Example', value: trim(answer.example, 1024) },
                { name: 'Rating', value: `${answer.thumbs_up} upvotes. ${answer.thumbs_down} downvotes.` },
            );

        message.channel.send(embed);
    },
};
