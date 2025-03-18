import { logger } from "../helpers/logger";
import { GoogleGenerativeAI } from '@google/generative-ai';

async function talkWithAi(prompt: string, gemini_token: string) {
  const genAI = new GoogleGenerativeAI(gemini_token);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const result = await model.generateContent(prompt);

  if (result) {
    return result.response.text().trim();
  }

  logger.error("Talking with ai failed!");
  throw new Error("ai prompt failed!")
}

export default talkWithAi;