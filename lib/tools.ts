import { tool } from "ai";
import { fetchTranscript } from "youtube-transcript";
import { z } from "zod";

export const fetchTranscriptTool = tool({
  description: "Get YouTube transcript by video ID",

  inputSchema: z.object({
    videoId: z.string(),
  }),

  execute: async ({ videoId }) => {
    const transcript = await fetchTranscript(videoId);

    const cleaned = transcript
      .map(t => t.text.replace(/^-+\s*/, "").trim())
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();

    return cleaned;
  },
});