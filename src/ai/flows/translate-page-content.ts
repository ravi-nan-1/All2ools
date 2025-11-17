'use server';
/**
 * @fileOverview A Genkit flow for translating all text content on a page in a single call.
 *
 * - translatePageContent - A function that translates a content object to a specified language.
 * - TranslatePageContentInput - The input type for the translatePageContent function.
 * - PageContentSchema - The Zod schema for the content object.
 * - TranslatedPageContentSchema - The Zod schema for the translated content object.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const PageContentSchema = z.object({
  description: z.string().describe('The main description of the tool.'),
  faq: z.string().describe('The Frequently Asked Questions content.'),
  features: z.array(z.string()).describe('A list of tool features.'),
  howItWorks: z.array(z.string()).describe('A list of steps explaining how the tool works.'),
  useCases: z.array(z.string()).describe('A list of common use cases for the tool.'),
});
export type PageContent = z.infer<typeof PageContentSchema>;

const TranslatePageContentInputSchema = z.object({
  content: PageContentSchema,
  targetLanguage: z.string().describe('The target language for translation (e.g., "Spanish", "Chinese").'),
});
export type TranslatePageContentInput = z.infer<typeof TranslatePageContentInputSchema>;

// The output schema is the same as the PageContentSchema
export const TranslatedPageContentSchema = PageContentSchema;
export type TranslatedPageContent = z.infer<typeof TranslatedPageContentSchema>;


export async function translatePageContent(input: TranslatePageContentInput): Promise<TranslatedPageContent> {
  return translatePageContentFlow(input);
}

const translatePageContentPrompt = ai.definePrompt({
  name: 'translatePageContentPrompt',
  input: {schema: TranslatePageContentInputSchema},
  output: {schema: TranslatedPageContentSchema},
  prompt: `Translate the following JSON object's string values into {{targetLanguage}}. Maintain the exact JSON structure and keys. Only return the translated JSON object, without any additional explanations or formatting.

Content to translate:
{{{json content}}}
`,
});

const translatePageContentFlow = ai.defineFlow(
  {
    name: 'translatePageContentFlow',
    inputSchema: TranslatePageContentInputSchema,
    outputSchema: TranslatedPageContentSchema,
  },
  async input => {
    const {output} = await translatePageContentPrompt(input);
    return output!;
  }
);
