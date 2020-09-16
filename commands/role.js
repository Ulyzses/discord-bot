module.exports = {
  name: 'role',
  description: 'Assigns a role to the tagged member or to the author if no member is specified',
  args: 1,
  usage: '[role] (member)',
  secret: false,
  guildOnly: true,
  aliases: ['r', 'set'],
  cooldown: 3,
  execute(message, args) {
    try {
      if ( args.length > 1 ) {
        message.member.roles.add(
          message.guild.roles.cache.find(role => role.name.toLowerCase() == args[0].toLowerCase())
        ).catch(alertError);

        message.reply("role set!");
      } else if ( args.length == 0 ) {
        message.reply("Insufficient parameters");
      }
    } catch(error) {
      alertError(error);
    }
  }
}
