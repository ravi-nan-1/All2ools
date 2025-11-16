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
});

export type GenerateSEOMetadataInput = z.infer<
  typeof GenerateSEOMetadataInputSchema
>;

const GenerateSEOMetadataOutputSchema = z.object({
  seoTitle: z.string().describe('The SEO title for the tool page.'),
  seoDescription: z.string().describe('The SEO description for the tool page.'),
  jsonLdSchema: z.string().describe('The JSON-LD schema for the tool page.'),
  faqContent: z.string().describe('The FAQ content for the tool page.'),
});

export type GenerateSEOMetadataOutput = z.infer<
  typeof GenerateSEOMetadataOutputSchema
>;

export async function generateSEOMetadata(
  input: GenerateSEOMetadataInput
): Promise<GenerateSEOMetadataOutput> {
  return generateSEOMetadataFlow(input);
}

const generateSEOMetadataPrompt = ai.definePrompt({
  name: 'generateSEOMetadataPrompt',
  input: {schema: GenerateSEOMetadataInputSchema},
  output: {schema: GenerateSEOMetadataOutputSchema},
  prompt: `You are an expert SEO content creator.
  Your task is to generate SEO metadata, JSON-LD schema, and FAQ content for a tool page based on the tool description provided.

  Tool Description: {{{toolDescription}}}

  Instructions:
  1.  SEO Title: Create a concise and compelling SEO title (50-60 characters).
  2.  SEO Description: Write a brief and informative SEO description (150-160 characters) that accurately summarizes the tool's functionality and benefits.
  3.  JSON-LD Schema: Generate a valid JSON-LD WebApplication schema that includes the tool's name, description, URL, and other relevant information.
  4.  FAQ Content: Develop a list of Frequently Asked Questions (FAQ) that address common user queries about the tool. Provide clear and concise answers.

  Output the SEO title, SEO description, JSON-LD schema, and FAQ content in the following format:
  {
  "seoTitle": "[Generated SEO Title]",
  "seoDescription": "[Generated SEO Description]",
  "jsonLdSchema": "[Generated JSON-LD Schema]",
  "faqContent": "[Generated FAQ Content]"
  }
  `,
});

const generateSEOMetadataFlow = ai.defineFlow(
  {
    name: 'generateSEOMetadataFlow',
    inputSchema: GenerateSEOMetadataInputSchema,
    outputSchema: GenerateSEOMetadataOutputSchema,
  },
  async input => {
    const {output} = await generateSEOMetadataPrompt(input);
    return output!;
  }
);
