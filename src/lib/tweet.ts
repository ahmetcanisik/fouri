import { logger } from "../helpers/logger";
import TwitterApi from 'twitter-api-v2';

async function getLatestTweet(username: string, twitter_token: string, retries = 3) {
  try {
    const xClient = new TwitterApi(twitter_token);
    const user = await xClient.v2.userByUsername(username);

    if (!user.data) {
      logger.error(`${username} not found on Twitter!`);
      throw new Error(`${username} not found on Twitter!`);
    }

    const userId = user.data.id;
    const tweets = await xClient.v2.userTimeline(userId, {
      max_results: 5
    });

    if (!tweets.data || tweets.data.data.length === 0) {
      logger.error(`${username} hasn't tweeted on Twitter!`);
      throw new Error(`${username} hasn't tweeted on Twitter!`);
    }

    return tweets.data.data[0].text;
  } catch (error: any) {
    if (error.code === 429 && retries > 0) {
      // Şu anki zaman (Unix timestamp olarak saniye cinsinden)
      const now = Math.floor(Date.now() / 1000);
      const resetTime = error.rateLimit?.reset ?? now + 60; // Eğer API reset süresi vermezse, 60 saniye bekle
      const waitTime = Math.max(resetTime - now, 60); // En az 60 saniye bekle

      const timeForUser = waitTime > 60 ? `${waitTime / 60} minute` : `${waitTime} seconds`
      logger.warn(`Rate limit exceeded! Retrying after ${timeForUser}...`);
      await new Promise(res => setTimeout(res, waitTime * 1000)); // Bekleme süresi

      return getLatestTweet(username, twitter_token, retries - 1); // Yeniden dene
    }

    logger.error(`Error fetching tweet for ${username}: ${error}`);
    throw new Error(`Failed to get latest tweet for ${username}`);
  }
}

export default getLatestTweet;