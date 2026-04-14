import { createSlackAdapter } from "@chat-adapter/slack";
import { createRedisState } from "@chat-adapter/state-redis";
import { Chat } from "chat";
import { zernioAdapter } from "./zernio";
import { createMemoryState } from "@chat-adapter/state-memory";

export const bot = new Chat({
  userName: "mybot",
  adapters: {
    slack: createSlackAdapter(),
    zernio: zernioAdapter,
  },
  state: createMemoryState(),
});

// Respond when someone @mentions the bot
bot.onNewMention(async (thread) => {
  await thread.subscribe();
  await thread.post("Hello! I'm listening to this thread now.");
});

// Respond to follow-up messages in subscribed threads
bot.onSubscribedMessage(async (thread, message) => {
  await thread.post(`You said: ${message.text}`);
});

bot.onNewMessage(/^help/, async (thread, message) => {
  const platform = (message.raw as any).platform;
  console.log("platform", platform)
  if (platform === 'bluesky') {
    await thread.post(`Hello from ${platform}!`);
  }
},)