'use server';
/**
 * @fileOverview A Genkit flow for translating all text content on a page in a single call.
 *
 * - translatePageContent - A function that translates a content object to a specified language.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TranslatePageContentInputSchema = z.object({
  content: z.any(),
  targetLanguage: z.string().describe('The target language for translation (e.g., "Spanish", "Chinese").'),
  schema: z.any(),
});
type TranslatePageContentInput = z.infer<typeof TranslatePageContentInputSchema>;

export async function translatePageContent(input: TranslatePageContentInput): Promise<any> {
  const prompt = ai.definePrompt({
    name: 'translatePageContentPrompt',
    input: {schema: TranslatePageContentInputSchema },
    output: {schema: input.schema },
    prompt: `Translate the following JSON object's string values into {{targetLanguage}}. Maintain the exact JSON structure and keys. Only return the translated JSON object, without any additional explanations or formatting.

  Content to translate:
  {{{json content}}}
  `,
  });

  const {output} = await prompt(input);
  return output!;
}
