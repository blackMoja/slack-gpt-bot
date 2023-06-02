import express from 'express';
import { WebClient } from '@slack/web-api';
import { createEventAdapter } from '@slack/events-api';
import { createServer } from 'http';
import * as dotenv from 'dotenv';
import { sendGpt } from './gpt';

dotenv.config();

const BOT_TAG_KEY = '<@U059QCLRDCK>';

const app = express();
const webClient = new WebClient(process.env.SLACK_BOT_USER_AUTH_TOKEN);
const slackEvents = createEventAdapter(process.env.SLACK_SIGNING_SECRET);

slackEvents.on('message', async (event) => {
  console.log('👀 이벤트 확인!! : ', event.text);
  const hasTagBot = event.text.includes(BOT_TAG_KEY);
  console.log('👀 태깅이 되었나요? : ', hasTagBot);

  if (hasTagBot) {
    const message = event.text.replace(BOT_TAG_KEY, '').trim();
    console.log('👀 메세지가 왔습니다. : ', message);
    if (message) {
      const response = await sendGpt(message);
      console.log('👀 GTP 응답이 왔습니다. : ', response);
      webClient.chat.postMessage({
        text: response,
        channel: event.channel,
      });
    }
  }
});

app.use('/slack/events', slackEvents.requestListener());

createServer(app).listen(3000, () => {
  console.log('✅ run slack bot');
});
