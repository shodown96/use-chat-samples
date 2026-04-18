const PRICING = {
  "gpt-4o": {
    input: 2.50,
    output: 10.00,
  },
  "gpt-4o-mini": {
    input: 0.15,
    output: 0.60,
  },
} as const;

type SupportedModel = keyof typeof PRICING;

export class CostTracker {
  private model: SupportedModel;
  private totalInputTokens = 0;
  private totalOutputTokens = 0;
  private totalCost = 0;
  private stepIndex = 0;

  constructor(model: SupportedModel) {
    this.model = model;
  }

  track(inputTokens: number, outputTokens: number) {
    this.stepIndex++;
    const pricing = PRICING[this.model];
    const inputCost = (inputTokens / 1_000_000) * pricing.input;
    const outputCost = (outputTokens / 1_000_000) * pricing.output;
    const stepCost = inputCost + outputCost;

    this.totalInputTokens += inputTokens;
    this.totalOutputTokens += outputTokens;
    this.totalCost += stepCost;

    console.log(`--- Step ${this.stepIndex} ---`);
    console.log(`Tokens — input: ${inputTokens}, output: ${outputTokens}`);
    console.log(`Cost — input: $${inputCost.toFixed(6)}, output: $${outputCost.toFixed(6)}, step total: $${stepCost.toFixed(6)}`);
  }

  summary() {
    console.log(`--- Total across ${this.stepIndex} steps ---`);
    console.log(`Tokens — input: ${this.totalInputTokens}, output: ${this.totalOutputTokens}`);
    console.log(`Total cost: $${this.totalCost.toFixed(6)}`);
  }
}