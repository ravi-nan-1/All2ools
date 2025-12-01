
'use server';

/**
 * @fileOverview A Genkit flow that generates compelling product descriptions for multiple e-commerce platforms.
 *
 * - generateProductDescription - A function that takes product details and returns a set of descriptions.
 * - GenerateProductDescriptionInput - The input type for the function.
 * - GenerateProductDescriptionOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

export const GenerateProductDescriptionInputSchema = z.object({
  productName: z.string().describe('The name of the product.'),
  features: z
    .string()
    .describe('A list of key features, benefits, or specifications of the product.'),
  targetAudience: z
    .string()
    .describe('The target audience for the product (e.g., "young professionals", "new mothers", "hardcore gamers").'),
  tone: z
    .string()
    .describe('The desired tone of voice (e.g., "persuasive", "professional", "friendly", "luxury").'),
});
export type GenerateProductDescriptionInput = z.infer<
  typeof GenerateProductDescriptionInputSchema
>;

export const GenerateProductDescriptionOutputSchema = z.object({
  shopify: z.object({
    title: z.string().describe('An SEO-friendly and engaging title suitable for a Shopify or general e-commerce store (50-70 characters).'),
    description: z.string().describe('A detailed, persuasive product description in HTML format, using paragraphs, bold tags for emphasis, and bullet points for features.'),
  }),
  amazon: z.object({
    title: z.string().describe('A keyword-rich title optimized for Amazon search, often including brand, material, key features, and quantity (under 200 characters).'),
    bulletPoints: z.array(z.string()).length(5).describe('An array of exactly 5 concise, benefit-oriented bullet points for an Amazon listing.'),
  }),
  socialMedia: z.object({
    instagram: z.string().describe('A short, engaging Instagram post caption with relevant emojis and hashtags.'),
    facebook: z.string().describe('A slightly more detailed Facebook post that encourages clicks and shares, possibly with a question.'),
  }),
});
export type GenerateProductDescriptionOutput = z.infer<
  typeof GenerateProductDescriptionOutputSchema
>;

export async function generateProductDescription(
  input: GenerateProductDescriptionInput
): Promise<GenerateProductDescriptionOutput> {
  return generateProductDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateProductDescriptionPrompt',
  input: { schema: GenerateProductDescriptionInputSchema },
  output: { schema: GenerateProductDescriptionOutputSchema },
  prompt: `You are an expert e-commerce copywriter. A user will provide details about a product, and your task is to generate compelling, platform-specific marketing copy.

Product Name: {{{productName}}}
Key Features/Benefits: {{{features}}}
Target Audience: {{{targetAudience}}}
Tone of Voice: {{{tone}}}

Based on this information, generate the following content:

1.  **Shopify / General E-commerce:**
    -   An SEO-friendly title (50-70 characters).
    -   A detailed, persuasive HTML description with paragraphs and bullet points.

2.  **Amazon Listing:**
    -   A keyword-rich title (under 200 characters).
    -   Exactly 5 benefit-driven bullet points.

3.  **Social Media Posts:**
    -   An engaging Instagram caption with emojis and hashtags.
    -   A slightly more detailed Facebook post designed to drive engagement.
`,
});

const generateProductDescriptionFlow = ai.defineFlow(
  {
    name: 'generateProductDescriptionFlow',
    inputSchema: GenerateProductDescriptionInputSchema,
    outputSchema: GenerateProductDescriptionOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
