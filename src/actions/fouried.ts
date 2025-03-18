import { logger } from '../helpers/logger';
import getLatestTweet from '../lib/tweet';
import talkWithAi from '../lib/ai';
import updateRepository from '../lib/repo';

interface TokensType {
  github: string;
  twitter: string;
  gemini: string;
}

interface FouriedType {
  twitterUsername: string;
  tokens: TokensType;
}

// Get latest tweet and send gemini then update github repository
async function Fouried({ twitterUsername, tokens }: FouriedType) {
  let latestTweet;
  try {
    latestTweet = await getLatestTweet(twitterUsername, tokens.twitter);
  } catch (error) {
    logger.error(`❌ Error fetching latest tweet: ${error}`);
    return;
  }

  if (!latestTweet) {
    logger.error("⚠️ Latest tweet not found!");
    return;
  }

  let urlAdress;
  try {
    urlAdress = await talkWithAi(
      `${latestTweet}\nParse this text in URL, add 'https://' at the beginning, and '.com' at the end. Return only the raw URL.`,
      tokens.gemini);
  } catch (error) {
    logger.error(`❌ Error communicating with AI: ${error}`);
    return;
  }

  if (!urlAdress) {
    logger.error("⚠️ AI response not found!");
    return;
  }

  try {
    const rules = /^https?:\/\/dizipal\d+\.[a-zA-Z]{2,}$/;
    if (rules.test(urlAdress)) {
      await updateRepository(tokens.github, { newURL: urlAdress });
    } else {
      logger.error(`⚠️ AI response '${urlAdress}' is not a valid URL format!`);
    }
  } catch (err: unknown) {
    logger.error(`❌ Error! New URL was not uploaded to GitHub!\n${err}`);
  }
}

export default Fouried;