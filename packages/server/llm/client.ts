import Openai from "openai";

const client = new Openai({
  apiKey: process.env.OPENAI_API_KEY,
});

type GenerateTextOptions = {
  model?: string;
  prompt: string;
  instructions?: string;
  temperature?: number;
  maxTokens?: number;
  previousResponseId?: string;
};

type GenerateTextResult = {
  id: string;
  text: string;
};

export const llmClient = {
  async generateText(
    options: GenerateTextOptions,
  ): Promise<GenerateTextResult> {
    const {
      model = "gpt-4.1",
      prompt,
      instructions,
      temperature = 0.2,
      maxTokens = 300,
      previousResponseId,
    } = options;
    const response = await client.responses.create({
      model,
      input: prompt,
      instructions,
      temperature,
      max_output_tokens: maxTokens,
      previous_response_id: previousResponseId,
    });
    return {
      id: response.id,
      text: response.output_text,
    };
  },
};
