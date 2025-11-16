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

export async function generateSEOMetadata(
  input: GenerateSEOMetadataInput
): Promise<GenerateSEOMetadataOutput> {
  return generateSEOMetadataFlow(input);
}


const generateSEOMetadataFlow = ai.defineFlow(
  {
    name: 'generateSEOMetadataFlow',
    inputSchema: GenerateSEOMetadataInputSchema,
    outputSchema: GenerateSEOMetadataOutputSchema,
  },
  async (input) => {
    // AI generation is removed to prevent errors. Returning a placeholder.
    const faqContent = 'FAQs are currently unavailable. Please check back later.';

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
      faqContent: faqContent,
      jsonLdSchema: JSON.stringify(jsonLd, null, 2),
    };
  }
);
