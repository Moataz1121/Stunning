import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';

@Injectable()
export class GeneratorService {
  private readonly logger = new Logger(GeneratorService.name);

  async generate(prompt: string, integrations: string[] = []): Promise<string> {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey.trim() === '') {
      this.logger.error('GEMINI_API_KEY environment variable is not configured.');
      throw new InternalServerErrorException(
        'Server configuration error: GEMINI_API_KEY is missing.',
      );
    }

    const selectedList =
      integrations && integrations.length > 0
        ? integrations.map((item) => `- ${item}`).join('\n')
        : '- None';

    const systemPrompt = `You are an AI builder helping users design software.

The user has selected the following integrations:
${selectedList}

Treat these integrations as available capabilities/context.
They are dummy integrations and are not actually connected.

Use the selected integrations when relevant to the user's request.`;

    try {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          systemInstruction: systemPrompt,
        },
      });

      const text = response.text;
      if (!text) {
        throw new Error('Empty response received from Gemini model.');
      }

      return text;
    } catch (error: any) {
      if (error instanceof InternalServerErrorException) {
        throw error;
      }
      this.logger.error(`Gemini generation error: ${error?.message || error}`);
      throw new InternalServerErrorException(
        'Failed to generate AI response. Please try again later.',
      );
    }
  }
}
