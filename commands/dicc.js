module.exports = {
  name: 'dicc',
  description: 'Determines the length of your dicc',
  args: 0,
  usage: '(user)',
  secret: true,
  guildOnly: false,
  aliases: ['d', 'dick', 'pp'],
  cooldown: 3,
  execute(message, args) {
    const random = Math.floor(Math.random() * 101) + 1;
    const length = Math.floor(Math.sqrt(random));

    if ( args.length ) {
      const mention = isUser(args[0]);

      if ( mention ) {
        if ( mention.id == message.author.id ) {
          message.reply(`your dicc looks liek 8${'='.repeat(length)}D`);
        } else {
          message.channel.send(`<@${mention.id}>'s dicc looks liek  8${'='.repeat(length)}D`)
        }
      } else {
        message.channel.send(`${args[0]}'s dicc 8${'='.repeat(length)}D`);
      }
    } else {
      message.reply(`your dicc looks liek 8${'='.repeat(length)}D`);
    }
  }
}