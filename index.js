'use strict'

/* Modules */
require('./utils.js');

const { prefix, discordToken } = require('./config.js');
const fs = require('fs');

const Discord = require('discord.js');
const discordClient = new Discord.Client()

/* Configure commands */
discordClient.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands');

for ( const file of commandFiles ) {
  const command = require(`./commands/${file}`);
  discordClient.commands.set(command.name, command);
}

/* Main */
discordClient.once('ready', () => {
  console.log("Ulyzses Bot is starting!");
});

discordClient.login(discordToken);

discordClient.on('message', message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).split(/ +/);
  const commandName = args.shift().toLowerCase();

  if ( !discordClient.commands.has(commandName) ) return;

  const command = discordClient.commands.get(commandName);

  if ( command.guildOnly && message.channel.type == 'dm' ) {
    return message.reply("Execute this command in servers ya coward");
  }

  if ( args.length < command.args ) {
    let reply = `Hey bud, you don't have enough arguments there.`;

    if ( command.usage ) {
      reply += `\nThe proper usage is \`${prefix}${command.name} ${command.usage}\``;
    }

    return message.reply(reply);
  }

  try {
    command.execute(message, args);
  } catch(error) {
    alertError(error, message);
  }
});