module.exports = {
    name: 'stats',
    description: 'The bot\'s stats, like total guilds, etc.',
    args: false,
    usage: false,
    guildOnly: false,
    cooldown: 15,
    aliases: ['bot'],
    execute(message, args) {
        client.shard.fetchClientValues('guilds.cache.size')
	        .then(results => {
		        console.log(`${results.reduce((acc, guildCount) => acc + guildCount, 0)} total guilds`);
	        })
	        .catch(console.error);
    },
};
