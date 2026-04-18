# Cross-Platform AI Bot (Vercel Chat SDK Experiment)

A lightweight experiment using Vercel Chat SDK and AI SDK to build a chatbot that can operate across multiple platforms from a single codebase.

Currently tested with Slack and Bluesky, with architecture designed to extend into platforms like WhatsApp, Twitter/X, Instagram, and more.

## Current Features

- Cross-platform bot architecture
- Slack integration
- Bluesky integration via Zernio
- AI chatbot responses powered by Vercel AI SDK
- YouTube video summarization
- Follow-up task execution based on summarized content
- Platform-aware message formatting
- Shared logic across integrations

## Tech Stack

- Next.js
- Vercel AI SDK
- Vercel Chat SDK
- Slack API
- Zernio
- TypeScript
- Redis

## Getting Started

Install dependencies:

```bash
npm install
````

Run the development server:

```bash
npm run dev
```

Open in browser:

```txt
http://localhost:3000
```

Expose the api for testing using ngrok (optional):

```bash
ngrok http 3000
```

## Environment Variables

Create a `.env.local` file and configure required credentials:

```env
ZERNIO_API_KEY=""
ZERNIO_WEBHOOK_SECRET=""

SLACK_BOT_TOKEN=""
SLACK_SIGNING_SECRET=""

REDIS_URL=redis://localhost:6379

OPENAI_API_KEY=""
```

Add any other provider keys depending on integrations enabled.

## Current Workflow

1. Receive message from platform (Slack / Bluesky) through webhooks
2. Route through shared bot logic
3. Process request with AI SDK
4. Return platform-formatted response
5. Support follow-up tasks

## Example Use Cases

* Summarize YouTube videos
* Ask follow-up questions about a video
* Multi-platform AI assistant
* Content repurposing workflows
* Automated support bots

## Next Steps

* MCP integrations
* Document extraction
* More Chat SDK adapters
* Optimizing system for Production 

## Status

Early prototype / active exploration.
