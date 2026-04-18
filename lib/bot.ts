import { openai } from "@ai-sdk/openai";
import { createSlackAdapter } from "@chat-adapter/slack";
import { createMemoryState } from "@chat-adapter/state-memory";
import { createRedisState } from "@chat-adapter/state-redis";
import { generateText, ModelMessage } from "ai";
import { Chat, ChatElement, PostableMessage } from "chat";
import { CostTracker } from "./pricing";
import { fetchTranscriptTool } from "./tools";
import { isLocal, isMarkdown } from "./utils";
import { zernioAdapter } from "./zernio";


const MODEL = "gpt-4o-mini";
const SYSTEM_PROMPT = `You are a helpful assistant.
You can:
- detect YouTube links
- call tools to fetch transcripts
- summarize content
`

export const bot = new Chat({
  userName: "mybot",
  adapters: {
    slack: createSlackAdapter(),
    zernio: zernioAdapter,
  },
  state: isLocal ? createRedisState() : createMemoryState(),
});

// Respond when someone @mentions the bot
bot.onNewMention(async (thread, message) => {
  await thread.subscribe();
  // await thread.post(`Hello ${message.author.userName}! I'm listening to this thread now.`);

  const result = await generateText({
    model: openai(MODEL),
    system: SYSTEM_PROMPT + `\nThe user's name is ${message.author.fullName}`,
    prompt: message.text,
  });
  await thread.post(result.text);
});

// Respond to follow-up messages in subscribed threads
bot.onSubscribedMessage(async (thread, message) => {
  const messages: ModelMessage[] = [];

  for await (const m of thread.allMessages) {
    messages.push({
      role: m.author.isBot ? 'assistant' : 'user',
      content: m.text,
    });
  }

  let currentMessages = [
    ...messages,
    { role: "user" as const, content: message.text }
  ];

  let finalText: string | PostableMessage | ChatElement = "";
  const costTracker = new CostTracker(MODEL);

  while (true) {
    const result = await generateText({
      model: openai(MODEL),
      system: SYSTEM_PROMPT,
      messages: currentMessages,
      tools: { fetchTranscript: fetchTranscriptTool },
    });

    costTracker.track(result.usage.inputTokens || 0, result.usage.outputTokens || 0);

    if (result.toolCalls.length === 0) {
      // No tool calls — this is the final text response
      finalText = isMarkdown(result.text) ? { markdown: result.text } : result.text;
      break;
    }

    // Append assistant tool call + tool results back into messages for next iteration
    currentMessages = [...currentMessages, ...result.response.messages];
  }

  costTracker.summary();
  await thread.post(finalText);
});

bot.onNewMessage(/^.*$/, async (thread, message) => {
  const platform = (message.raw as any).platform;
  // await thread.post(`Hello from ${platform}!`);
  // if (platform === 'bluesky') {
  const result = await generateText({
    model: openai(MODEL),
    system: SYSTEM_PROMPT + `\nThe user's name is ${message.author.fullName}`,
    prompt: message.text,
  });
  await thread.post(result.text);
  // }
})
