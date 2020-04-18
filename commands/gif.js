const { giphyKey } = require('../config.js');
const Giphy = require('giphy-js-sdk-core');
const giphyClient = Giphy(giphyKey);

module.exports = {
  name: 'gif',
  description: 'Sends a random GIF of the given keyword. If keyword is ommitted or is "random", sends a random GIF instead. Powered by Giphy.',
  args: 0,
  usage: "(keyword)",
  guildOnly: false,
  cooldown: 3,
  async execute(message, args) {
    try {
      if ( !args[0] || args[0].toLowerCase() == "random" ) {
        // Send a random GIF

        let botMessage = await message.channel.send('Looking for random GIFs...');
        
        giphyClient.random('gifs', {})
          .then(response => {
            botMessage.delete();
            message.channel.send('', {files: [response.data.images.original.gif_url]});
          })
          .catch(error => alertError(error, message));
      } else {
        // Sends a GIF of the keyword
        let keyword = args[0];

        let botMessage = await message.channel.send(`Looking for GIFS of ${keyword}...`);

        giphyClient.search('gifs', { q: keyword })
          .then(response => {
            let random = Math.floor(Math.random() * response.data.length);
            botMessage.delete();
            message.channel.send('', {files: [response.data[random].images.fixed_height.url]});
          })
          .catch(error => alertError(error, message));
      }
    } catch(error) { 
      alertError(error, message);
    }
  }
}