'use server';

/**
 * @fileOverview Analyzes text content against top-ranking competitors to identify missing keywords and SERP intent issues, providing optimization advice.
 *
 * - analyzeContentGap - A function that analyzes content and provides SERP intent optimization advice based on competitor analysis.
 * - AnalyzeContentGapInput - The input type for the analyzeContentGap function.
 * - AnalyzeContentGapOutput - The return type for the analyzeContentGap function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeContentGapInputSchema = z.object({
  text: z.string().describe('The text content to analyze for content gaps and SERP intent.'),
  competitorUrls: z.array(z.string()).describe('URLs of top-ranking competitors for the target keyword.'),
});
export type AnalyzeContentGapInput = z.infer<typeof AnalyzeContentGapInputSchema>;

const AnalyzeContentGapOutputSchema = z.object({
  advice: z.string().describe('Advice on how to improve the content by addressing content gaps and SERP intent issues.'),
});
export type AnalyzeContentGapOutput = z.infer<typeof AnalyzeContentGapOutputSchema>;

export async function analyzeContentGap(input: AnalyzeContentGapInput): Promise<AnalyzeContentGapOutput> {
  return analyzeContentGapFlow(input);
}

const analyzeContentGapPrompt = ai.definePrompt({
  name: 'analyzeContentGapPrompt',
  input: {schema: AnalyzeContentGapInputSchema},
  output: {schema: AnalyzeContentGapOutputSchema},
  prompt: `You are an SEO expert. Analyze the provided text content against the content found at the following competitor URLs. Identify content gaps, missing keywords, and SERP intent issues. Provide specific advice on how to improve the content to better address user intent and rank higher in search results.\n\nText Content: {{{text}}}\n\nCompetitor URLs: {{{competitorUrls}}}
`,
});

const analyzeContentGapFlow = ai.defineFlow(
  {
    name: 'analyzeContentGapFlow',
    inputSchema: AnalyzeContentGapInputSchema,
    outputSchema: AnalyzeContentGapOutputSchema,
  },
  async input => {
    const {output} = await analyzeContentGapPrompt(input);
    return output!;
  }
);
