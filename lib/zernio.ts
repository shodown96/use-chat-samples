import { createZernioAdapter } from "@zernio/chat-sdk-adapter";

export const zernioAdapter = createZernioAdapter({
  apiKey: process.env.ZERNIO_API_KEY,
  webhookSecret: process.env.ZERNIO_WEBHOOK_SECRET,
  baseUrl: "https://zernio.com/api",
  botName: "My Bot",
});
