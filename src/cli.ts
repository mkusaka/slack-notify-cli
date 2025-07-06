#!/usr/bin/env node
import { Command } from 'commander';
import * as dotenv from 'dotenv';
import { SlackClient } from './slack-client.js';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));
const packageJson = JSON.parse(readFileSync(resolve(__dirname, '../package.json'), 'utf-8'));

const program = new Command();

program
  .name('slack-notify')
  .description('Send notifications to Slack from the command line')
  .version(packageJson.version)
  .argument('<message>', 'Message to send')
  .option('-c, --channel <channel>', 'Slack channel (e.g., #general or C1234567890)')
  .option('-t, --title <title>', 'Optional title for the message')
  .option('-m, --mention <users>', 'User IDs to mention (comma-separated)')
  .option('--token <token>', 'Slack bot token (or use SLACK_BOT_TOKEN env var)')
  .action(async (message, options) => {
    try {
      const token = options.token || process.env.SLACK_BOT_TOKEN;
      if (!token) {
        console.error('Error: Slack bot token is required. Set SLACK_BOT_TOKEN environment variable or use --token option.');
        process.exit(1);
      }

      const defaultChannel = process.env.SLACK_DEFAULT_CHANNEL;
      const defaultMentions = process.env.SLACK_MENTIONS;

      const client = new SlackClient(token, defaultChannel, defaultMentions);

      await client.sendMessage({
        channel: options.channel,
        title: options.title,
        description: message,
        mention: options.mention,
      });

      console.log('✅ Message sent successfully!');
    } catch (error) {
      console.error('❌ Failed to send message:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

program.parse();