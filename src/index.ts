#!/usr/bin/env node
import { Command } from "commander";
import { GetPKGInfo } from "./helpers/pkg";
import Fouried from "./actions/fouried";
import 'dotenv/config';

async function main() {
  const { name, description, version } = await GetPKGInfo();

  const fouri = new Command();

  fouri
    .name(name)
    .usage("[command]")
    .description(description)
    .version(version, "-v, --version", "Output the current version")
    .helpOption("-h, --help", "Display help for command")
    .action(async () => {
      if (
        !process.env.GITHUB_TOKEN ||
        !process.env.TWITTER_BEARER_TOKEN ||
        !process.env.GEMINI_API_KEY
      ) {
        throw new Error("please check your tokens! because not found!");
      }

      await Fouried({
        twitterUsername: "5dizipal5",
        tokens: {
          github: process.env.GITHUB_TOKEN,
          twitter: process.env.TWITTER_BEARER_TOKEN,
          gemini: process.env.GEMINI_API_KEY
        }
      });
    });

  fouri.parse();
}

if (require.main === module) {
  (async () => await main())();
}
