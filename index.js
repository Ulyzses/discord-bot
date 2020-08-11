'use strict'

/* Modules */
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
discordClient.login(discordToken);

discordClient.once('ready', () => {
  log("Ulyzses Bot is starting!", true);
});

discordClient.on('message', message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).split(/ +/);
  const commandName = args.shift().toLowerCase();

  // Look for the command or alias in the commands collection
  const command = discordClient.commands.get(commandName)
    || discordClient.commands.find(cmd => cmd.aliases.includes(commandName));

  if ( !command ) return;

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
    log(message);
  } catch(error) {
    alertError(error, message);
  }
});

// Welcome
discordClient.on('guildMemberAdd', guildMember => {
  const guild = guildMember.guild;

  if ( !guild.available ) return log("Guild not available", true)

  // Attempt to get original channel
  if ( guild.channels.has(guild.id) ) {
    const defaultChannelID = guild.channels.get(guild.id);
    log("Found original channel", true);
  } else {
    // find a channel that starts with general or welcome
    const defaultChannelID = guild.channels.cache.find(channel => 
      channel.startsWith('general') || channel.startsWith('welcome')
    );
    log("Found channel starting with original or general")
  }
});

/* UTILITY FUNCTIONS */
global.alertError = (error, message) => {
  console.error(error);

  let errorMessage = `<@${process.env.DISCORD_ID}>\`\`\`error from ${getSource(message)}\n${error}\`\`\``;

  // Sends the error to my DM along with the error message
  discordClient.channels.fetch(process.env.ERROR_CHANNEL)
    .then(channel => channel.send(errorMessage))
    .catch(error => {
      console.error("Error was unable to be sent to the error channel");
      console.error(error);
    }); // We're screwed if this happens

  message.channel.send("There was an error trying to execute that command.");
}

global.log = (message, debug = false) => {
  if ( debug ) {
    console.log(message);
    var logMessage = `\`\`\`${message}\`\`\``;
  } else {
    console.log(message.content);
    var logMessage = `\`\`\`${getSource(message)}: ${message.content}\`\`\``;
  }
  
  // Logs in the log channel in Discord (because I'm lazy to check actual logs)
  discordClient.channels.fetch(process.env.LOG_CHANNEL)
    .then(channel => channel.send(logMessage))
    .catch(error => alertError(error, message));
}

global.isUser = (user) => {
  if ( user.startsWith('<@') && user.endsWith('>') ) {
    user = user.slice(2, -1);

    if ( user.startsWith('!') ) {
      user = user.slice(1);
    }

    return discordClient.users.cache.get(user);
  }

  return false;
}

function getSource(message) {
  return (message.channel.type == 'dm') ? `DM: ${message.channel.recipient.tag}` : `Guild: ${message.guild.name}#${message.channel.name} (${message.author.username})`;Guild
}