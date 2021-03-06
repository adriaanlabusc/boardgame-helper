const __CONFIG__ = require('../config')
const logger = require('../utils/logger')
const Bot = require('@kikinteractive/kik')
const shuffle = require('shuffle-array')

const handleStartChatAndScanData = function(incoming) {
  const message = Bot.Message.text(`Hey ${incoming.from}! I can help you choose teams or a starting player for a board game. Just type @${__CONFIG__.kik.botUsername} in a group chat to see all the available commands!`);
  incoming.reply(message);
};

const handleUnsupportedMessageTypes = function(incoming) {
  incoming.reply(`Doh! I don't understand these messages! Just type @${__CONFIG__.kik.botUsername} to see available commands`);
};

const createGroups = function(participants, numGroups) {
  if (participants.length < numGroups) return false;

  const groups = new Array(numGroups);
  shuffle(participants);

  for (let i = 0; i < participants.length; i++) {
    let groupIndex = i%groups.length;
    if (!groups[groupIndex]) groups[groupIndex] = [];
    // give each group another user in turn
    groups[groupIndex].push(participants[i]);  
  }

  return groups;
};

const createGroupMessages = function (groups) {
  const groupsMessages = [];
  for (let i = 0; i < groups.length; i++) {
    groupsMessages.push(`Group ${i+1}: ${groups[i]}`);
  }
  return groupsMessages;
};


const messages = {
  notEnoughUsers: `You need more users than groups...either reduce the number of groups or add more users.`
}

function hooks(bot) {
  bot.onTextMessage(/^pick first player$/i, (incoming, bot) => {
    let winningIndex = Math.floor(Math.random() * incoming.participants.length);
    let winner = incoming.participants[winningIndex];
    
    incoming.reply(`The first player is: ${winner}`);
  });

  bot.onTextMessage(/^create two groups$/i, (incoming, bot) => {
    const groups = createGroups(incoming.participants, 2);

    if (groups) {
      incoming.reply(createGroupMessages(groups));
    } else {
      incoming.reply(messages.notEnoughUsers);
    }
  });

  bot.onTextMessage(/^create three groups$/i, (incoming, bot) => {
    const groups = createGroups(incoming.participants, 3);

    if (groups) {
      incoming.reply(createGroupMessages(groups));
    } else {
      incoming.reply(messages.notEnoughUsers);
    }
  });

  // handle any text message that isn't specifically supported
  bot.onTextMessage((incoming, next) => {
    if (incoming.participants.length > 1) { 
      var message = Bot.Message.text('Choose action.')
        .addTextResponse('Pick first player')
        .addTextResponse('Create two groups')
        .addTextResponse('Create three groups');
    } else {
      var message = Bot.Message.text(`Add more users to the chat and then use me to pick teams or a starting player. Just type @${__CONFIG__.kik.botUsername} in the group chat to see all the available commands!`);
    }

    return incoming.reply(message)
  })

  // [handler] on subscribe to bot
  // this may happen a variety of ways
  //    1. when a new user uses @botname [messageHere]
  //    2. when you scan a kik code of the bot
  //    3. maybe more?
  bot.onStartChattingMessage(handleStartChatAndScanData);
  bot.onScanDataMessage(handleStartChatAndScanData)
  
  // things the bot doesn't understand
  bot.onLinkMessage(handleUnsupportedMessageTypes);
  bot.onPictureMessage(handleUnsupportedMessageTypes);
  bot.onVideoMessage(handleUnsupportedMessageTypes);
  bot.onStickerMessage(handleUnsupportedMessageTypes);
}

module.exports = hooks
