module.exports = {
  name: 'waifu',
  description: 'Determines how much of a waifu you are',
  args: 0,
  usage: '(user)',
  secret: true,
  guildOnly: false,
  aliases: ['w'],
  cooldown: 3,
  execute(message, args) {
    const random = Math.floor(Math.random() * 101) + 1;

    if ( args.length ) {
      const mention = isUser(args[0]);

      if ( mention ) {
        if ( mention.id == message.author.id ) {
          message.reply(`you are ${random}% waifu material!`);
        } else {
          message.channel.send(`<@${mention.id}> is ${random}% waifu material!`)
        }
      } else {
        message.channel.send(`${args[0]} is ${random}% waifu material!`);
      }
    } else {
      message.reply(`you are ${random}% waifu material!`);
    }
  }
}