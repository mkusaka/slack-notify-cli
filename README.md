# slack-notify-cli

A simple command-line tool to send notifications to Slack.

## Installation

```bash
pnpm install -g slack-notify-cli
```

Or install locally:

```bash
git clone https://github.com/mkusaka/slack-notify-cli.git
cd slack-notify-cli
pnpm install
pnpm build
pnpm link
```

## Configuration

Set up your Slack bot token:

```bash
export SLACK_BOT_TOKEN=xoxb-your-token-here
```

Optional environment variables:

```bash
export SLACK_DEFAULT_CHANNEL=#general
export SLACK_MENTIONS=U1234567890,U0987654321
```

## Usage

```bash
# Send a simple message
slack-notify "Hello from the command line!"

# Send to a specific channel
slack-notify "Important update" -c #announcements

# Send with a title
slack-notify "Deployment completed successfully" -t "Deployment Status"

# Mention specific users
slack-notify "Please review this PR" -m U1234567890,U0987654321

# Override token (not recommended, use env var instead)
slack-notify "Test message" --token xoxb-different-token
```

## Development

```bash
# Install dependencies
pnpm install

# Run in development mode
pnpm dev "Test message"

# Build the project
pnpm build

# Type check
pnpm typecheck

# Lint
pnpm lint

# Format code
pnpm format
```

## Requirements

- Node.js 18+
- A Slack bot token with `chat:write` scope
- The bot must be invited to channels where you want to send messages