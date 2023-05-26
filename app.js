require('dotenv').config();

const express = require('express');
const { WebClient } = require('@slack/web-api');
const { createEventAdapter } = require('@slack/events-api');
const { createServer } = require('http');

const app = express();
const webClient = new WebClient(process.env.SLACK_BOT_USER_AUTH_TOKEN);
const slackEvents = createEventAdapter(process.env.SLACK_SIGNING_SECRET);

slackEvents.on('message', async (event) => {
  console.log(event);

  if (event.text == '?하이') {
    webClient.chat.postMessage({
      text: '안녕하세요!',
      channel: event.channel,
    });
  }
});

app.use('/slack/events', slackEvents.requestListener());

createServer(app).listen(3000, () => {
  console.log('✅ run slack bot');
});
