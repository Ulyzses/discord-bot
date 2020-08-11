const Canvas = require('canvas');
const fs = require('fs');

module.exports = {
  name: 'text-to-image',
  description: 'Converts a string into an image',
  args: 1,
  usage: '"[message]"',
  secret: false,
  guildOnly: false,
  aliases: ['text2img', 'tti', 't2i', 'text-to-picture', 'text-to-pic', 'text2pic', 'ttp', 't2p'],
  cooldown: 10,
  execute(message, args) {
    let text;

    if ( args.length > 1 ) {
      let match = message.content.match(/"([^"]+)"/);

      if ( match == null ) {
        return message.reply("Invalid parameters. Enclose in quotation marks `\"\"` if text is more than one word.");
      } else {
        text = match[1]
      }
    } else {
      text = args[0];
    }

    try {
      /* FROM TEXT2IMG */
      const width = 9;
      const height = 3;
      const rHeight = 1080;
      const rWidth = 1920;

      let fileName = randomName();

      var maintext = text.slice(0, - text.length % 3) || text;
      var extra = text.length % 3 ? text.slice(- text.length % 3) : "";

      var count = maintext.length / 3;

      // Convert to ASCII code
      var mainASCII = maintext.split('').map(char => char.charCodeAt(0))
      var colours = [];

      for ( let i = 0; i < count; ++i ) {
        let colour = [];

        for ( let j = 0; j < 3; ++j ) {
          colour.push( mainASCII[i * 3 + j] );
        }

        colours.push( `rgb(${colour.join(',')})` );
      }

      if ( extra ) var extraHex = "+" + extra.split('').map(char => char.charCodeAt(0).toString(16)).join('');

      /* Draw on canvas */
      const canvas = Canvas.createCanvas(rWidth, rHeight);
      const ctx = canvas.getContext('2d');

      for ( let i = 0; i < count; ++i ) {
        ctx.fillStyle = colours[i];
        ctx.fillRect(i * rWidth / count, 0, rWidth / count, rHeight);
      }

      /* Add text */
      if ( extra ) {
        ctx.font = '288px Comic Sans MS';
        ctx.fillStyle = 'black';
        ctx.textAlign = 'right';
        var extraText = ctx.measureText(`+${extraHex}`);

        ctx.fillText(extraHex, rWidth - 32, rHeight - extraText.actualBoundingBoxDescent - 32);
      }

      /* Save image */
      var data = canvas.toDataURL().replace(/^data:image\/\w+;base64,/, "");
      var buffer = Buffer.from(data, 'base64');

      fs.writeFileSync(`temp/${fileName}.png`, buffer);

      /* Send image */
      message.channel.send('', {files: [`temp/${fileName}.png`]});

    } catch(error) {
      alertError(error, message);
    }
  }
}

function randomName() {
  let string = "";

  for ( let i = 0; i < 8; ++i ) {
    string += Math.floor(Math.random() * 10);
  }
  
  return string;
}