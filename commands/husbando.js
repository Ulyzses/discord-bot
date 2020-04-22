module.exports = {
  name: 'husbando',
  description: 'Determines how much of a husbando you are',
  args: 0,
  usage: '(user)',
  guildOnly: false,
  aliases: ['h'],
  cooldown: 3,
  execute(message, args) {
    const random = Math.floor(Math.random() * 101) + 1;

    if ( args.length ) {
      const mention = isUser(args[0]);

      if ( mention ) {
        if ( mention.id == message.author.id ) {
          message.reply(`you are ${random}% husbando material!`);
        } else {
          message.channel.send(`<@${mention.id}> is ${random}% husbando material!`)
        }
      } else {
        message.channel.send(`${args[0]} is ${random}% husbando material!`);
      }
    } else {
      message.reply(`you are ${random}% husbando material!`);
    }
  }
}