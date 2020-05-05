const { prefix } = require('../config.js')

module.exports = {
  name: 'help',
  description: 'Lists all of my commands or information about a specific command',
  args: 0,
  usage: '(command)',
  secret: false,
  guildOnly: false,
  aliases: ['h', 'command', 'commands', 'info'],
  cooldown: 3,
  execute(message, args) {
    let data = [];
    let { commands } = message.client;

    if ( !args.length ) {
      data.push('Here\'s a list of my commands!');

      data.push(commands
        .filter(item => !item.secret)
        .map(command => `\`${command.name}\``)
        .join(', ')
      );

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
      const command = message.client.commands.get(commandName)
        || message.client.commands.find(cmd => cmd.aliases.includes(commandName));

      if ( !command ) {
        return message.reply('send an actual command <:angry:700593630934597674>');
      }

      let aliases;

      if ( command.aliases ) {
        aliases = command.aliases.map(alias => `\`${alias}\``).join(', ');
      } else {
        aliases = "none";
      }

      data.push(`**Command:** \`${commandName}\``);
      data.push(`**Aliases:** ${aliases}`);
      data.push(`**Description:** ${command.description}`);
      data.push(`**Usage:** \`${prefix}${commandName} ${command.usage}\``);

      message.channel.send(data);
    }
  }
}