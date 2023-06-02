import { Configuration, OpenAIApi } from 'openai';
import * as dotenv from 'dotenv';

dotenv.config();

console.log('API KEY : ', process.env.GPT_API_KEY);

const configuration = new Configuration({
  apiKey: process.env.GPT_API_KEY,
});
const openai = new OpenAIApi(configuration);

export const sendGpt = async (message: string) => {
  try {
    const completion = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: message,
      temperature: 0.6,
      max_tokens: 3000,
    });
    return completion.data.choices[0].text;
  } catch (error) {
    if (error.response) {
      console.error('🔴 에러코드를 확인합니다. :::> ', error.response.status);
      console.error('🔴 에러내용을 확인합니다. :::> ', error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
    }
  }
};
