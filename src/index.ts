#!/usr/bin/env node
import { Command } from "commander";
import { GetPKGInfo } from "./helpers/pkg";
import Fouried from "./actions/fouried";
import 'dotenv/config';

async function main() {
  const { name, description, version } = await GetPKGInfo();
  const twitterUser = "5dizipal5";
  const fouri = new Command();

  fouri
    .name(name)
    .usage("[command]")
    .description(description)
    .version(version, "-v, --version", "Output the current version")
    .helpOption("-h, --help", "Display help for command")
    .option("-u, --user <string>", `Get latest post for the specific twitter user. default: ${twitterUser}`)
    .option("-g, --github <string>", "Github Token")
    .option("-t, --twitter <string>", "Twitter Bearer Token")
    .option("-a, --gemini, --ai <string>", "AI(Gemini) Token")
    .action(async (_, options) => {
      if (
        (!process.env.GITHUB_TOKEN && !options.github) ||
        (!process.env.TWITTER_BEARER_TOKEN && !options.twitter) ||
        (!process.env.GEMINI_API_KEY && !options.gemini)
      ) {
        throw new Error("please check your tokens! because not found!");
      }

      await Fouried({
        twitterUsername: options.user ?? twitterUser,
        tokens: {
          github: options.github ? options.github : process.env.GITHUB_TOKEN,
          twitter: options.twitter ? options.twitter : process.env.TWITTER_BEARER_TOKEN,
          gemini: options.gemini ? options.gemini : process.env.GEMINI_API_KEY
        }
      });
    });

  fouri.parse();
}

if (require.main === module) {
  (async () => await main())();
}
