'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating SEO metadata, JSON-LD schema, and FAQ content for tool pages.
 *
 * It exports:
 * - `generateSEOMetadata`: An async function that takes a tool description as input and returns SEO metadata, JSON-LD schema, and FAQ content.
 * - `GenerateSEOMetadataInput`: The input type for the `generateSEOMetadata` function.
 * - `GenerateSEOMetadataOutput`: The output type for the `generateSEOMetadata` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSEOMetadataInputSchema = z.object({
  toolDescription: z
    .string()
    .describe('The detailed description of the tool.'),
  toolName: z.string().describe('The name of the tool.'),
});

export type GenerateSEOMetadataInput = z.infer<
  typeof GenerateSEOMetadataInputSchema
>;

const GenerateSEOMetadataOutputSchema = z.object({
  seoTitle: z.string().describe('The SEO title for the tool page.'),
  seoDescription: z.string().describe('The SEO description for the tool page.'),
  jsonLdSchema: z.string().describe('A valid JSON-LD WebApplication schema as a string.'),
  faqContent: z.string().describe('A multi-line string containing 3-5 frequently asked questions and their answers.'),
});

export type GenerateSEOMetadataOutput = z.infer<
  typeof GenerateSEOMetadataOutputSchema
>;

const GenerateFaqOutputSchema = z.object({
  faqContent: z
    .string()
    .describe(
      'A multi-line string containing 3-5 frequently asked questions and their answers.'
    ),
});

export async function generateSEOMetadata(
  input: GenerateSEOMetadataInput
): Promise<GenerateSEOMetadataOutput> {
  return generateSEOMetadataFlow(input);
}

const generateFaqPrompt = ai.definePrompt({
  name: 'generateFaqPrompt',
  input: {schema: GenerateSEOMetadataInputSchema},
  output: {schema: GenerateFaqOutputSchema},
  model: 'googleai/gemini-1.5-flash-latest',
  system: 'You are an expert SEO content creator.',
  prompt: `
  Your task is to generate a list of 3-5 Frequently Asked Questions (FAQs) for a tool page based on the tool name and description provided. Provide clear and concise answers. Format it as a single multi-line string.

  Tool Name: {{{toolName}}}
  Tool Description: {{{toolDescription}}}
  `,
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_ONLY_HIGH',
      },
    ],
  },
});

const generateSEOMetadataFlow = ai.defineFlow(
  {
    name: 'generateSEOMetadataFlow',
    inputSchema: GenerateSEOMetadataInputSchema,
    outputSchema: GenerateSEOMetadataOutputSchema,
  },
  async input => {
    let faqResult = { faqContent: 'FAQs could not be generated at this time.' };
    
    try {
      const { output } = await generateFaqPrompt(input);
      if (output) {
        faqResult = output;
      }
    } catch (e) {
      console.error("FAQ generation failed, using default.", e)
    }

    const seoTitle = `${input.toolName} | All2ools`;
    const seoDescription = input.toolDescription.substring(0, 160);

    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: input.toolName,
      description: seoDescription,
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Any',
    };

    return {
      seoTitle,
      seoDescription,
      faqContent: faqResult.faqContent,
      jsonLdSchema: JSON.stringify(jsonLd, null, 2),
    };
  }
);
