import { WebClient } from '@slack/web-api';
import type { Block, KnownBlock } from '@slack/types';

export interface SlackMessage {
  channel?: string;
  title?: string;
  description: string;
  mention?: string;
}

export class SlackClient {
  private client: WebClient;
  private defaultChannel?: string;
  private defaultMentions?: string;

  constructor(token: string, defaultChannel?: string, defaultMentions?: string) {
    this.client = new WebClient(token);
    this.defaultChannel = defaultChannel;
    this.defaultMentions = defaultMentions;
  }

  async sendMessage(message: SlackMessage): Promise<void> {
    const channel = message.channel || this.defaultChannel;
    if (!channel) {
      throw new Error('No channel specified and no default channel configured');
    }

    const blocks = this.createBlocks(message);
    const text = this.createFallbackText(message);

    await this.client.chat.postMessage({
      channel,
      blocks,
      text,
    });
  }

  private createBlocks(message: SlackMessage): (Block | KnownBlock)[] {
    const blocks: (Block | KnownBlock)[] = [];

    if (message.title) {
      blocks.push({
        type: 'header',
        text: {
          type: 'plain_text',
          text: message.title,
          emoji: true,
        },
      });
    }

    const mentions = message.mention || this.defaultMentions;
    const mentionText = mentions
      ? mentions.split(',').map(id => `<@${id.trim()}>`).join(' ') + ' '
      : '';

    blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: mentionText + message.description,
      },
    });

    if (message.title) {
      blocks.push({ type: 'divider' });
    }

    return blocks;
  }

  private createFallbackText(message: SlackMessage): string {
    return message.title
      ? `${message.title}: ${message.description}`
      : message.description;
  }
}