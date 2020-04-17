const { prefix } = require('../config.js')

module.exports = {
  name: 'help',
  description: 'Lists all of my commands or information about a specific command',
  args: 0,
  usage: '(command)',
  guildOnly: false,
  cooldown: 3,
  execute(message, args) {
    let data = [];
    let { commands } = message.client;

    if ( !args.length ) {
      data.push('Here\'s a list of all my commands!');
      data.push(commands.map(command => `\`${command.name}\``).join(', '));
      data.push(`You can send \`${prefix}help [command]\` to get info on a specific command`);

      message.author.send(data, { split: true })
        .then(() => {
          if ( message.channel.type == 'dm' ) return;
          message.reply("DM sent <:wink:700584643489169459>");
        })
        .catch(error => {
          alertError(error, message);
        })
    } else {
      const commandName = args[0].toLowerCase();
      const command = commands.get(commandName);

      if ( !command ) {
        return message.reply('send an actual command <:angry:700593630934597674>');
      }

      data.push(`**Command:** \`${commandName}\``);
      data.push(`**Description:** ${command.description}`);
      data.push(`**Usage:** \`${prefix}${commandName} ${command.usage}\``);

      message.channel.send(data);
    }
  }
}