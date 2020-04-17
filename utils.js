'use strict'

global.alertError = (error, message) => {
  console.error(error);
  message.channel.send("There was an error trying to execute that command. Paging <@227409936009658368>, your code sucks!");
}