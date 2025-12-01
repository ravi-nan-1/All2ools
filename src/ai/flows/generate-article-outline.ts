
'use server';
/**
 * @fileOverview A Genkit flow that generates a detailed article outline from a topic, URL, or pasted text.
 *
 * - generateArticleOutline - A function that takes a topic and returns a structured article outline.
 * - GenerateArticleOutlineInput - The input type for the function.
 * - GenerateArticleOutlineOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateArticleOutlineInputSchema = z.object({
  topic: z.string().describe('The main topic or keyword for the article.'),
  sourceUrl: z.string().optional().describe("An optional URL to a source article to base the outline on."),
  pastedText: z.string().optional().describe("Optional pasted text (e.g., keywords, notes, a rough draft) to inform the outline."),
  tone: z.string().optional().describe("The desired tone of voice for the article (e.g., 'professional', 'casual', 'expert')."),
  audience: z.string().optional().describe("The target audience for the article (e.g., 'beginners', 'experts')."),
});
export type GenerateArticleOutlineInput = z.infer<typeof GenerateArticleOutlineInputSchema>;

const FAQSchema = z.object({
    question: z.string().describe("A frequently asked question related to the topic."),
    answer: z.string().describe("A concise answer to the question."),
});

const SubsectionSchema = z.object({
    heading: z.string().describe("The H3 heading for this subsection."),
    points: z.array(z.string()).describe("A list of key talking points or bullet points for this subsection."),
});

const SectionSchema = z.object({
    heading: z.string().describe("The H2 heading for this section."),
    subsections: z.array(SubsectionSchema).optional().describe("An array of H3 subsections."),
});

const GenerateArticleOutlineOutputSchema = z.object({
  title: z.string().describe('A compelling, SEO-friendly H1 title for the article.'),
  introduction: z.string().describe('A brief, engaging introduction to the article.'),
  sections: z.array(SectionSchema).describe("An array of main article sections, each with an H2 heading."),
  conclusion: z.string().describe('A brief, impactful concluding paragraph.'),
  faq: z.array(FAQSchema).optional().describe("A list of 3-5 frequently asked questions and their answers to include at the end."),
});
export type GenerateArticleOutlineOutput = z.infer<typeof GenerateArticleOutlineOutputSchema>;

export async function generateArticleOutline(input: GenerateArticleOutlineInput): Promise<GenerateArticleOutlineOutput> {
  return generateArticleOutlineFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateArticleOutlinePrompt',
  input: { schema: GenerateArticleOutlineInputSchema },
  output: { schema: GenerateArticleOutlineOutputSchema },
  prompt: `You are an expert content strategist and SEO specialist. Your task is to create a comprehensive, well-structured, and SEO-optimized article outline based on the provided information.

The outline must be detailed and logical, suitable for a long-form blog post or guide. It should include:
1.  A single, compelling H1 title.
2.  A short, engaging introduction.
3.  A series of main sections, each with a clear H2 heading.
4.  Within each H2 section, include relevant H3 sub-sections with their own headings.
5.  Under each H3, provide a few key talking points or bullet points.
6.  A concise concluding paragraph.
7.  A "Frequently Asked Questions" (FAQ) section at the end with 3-5 relevant questions and their brief answers.

Primary Topic: {{{topic}}}

{{#if tone}}
Tone of Voice: The article should be written in a {{{tone}}} tone.
{{/if}}

{{#if audience}}
Target Audience: The article should be written for {{{audience}}}.
{{/if}}

{{#if sourceUrl}}
Source URL: Use the content at this URL as the primary inspiration and context for the new outline: {{{sourceUrl}}}
{{/if}}

{{#if pastedText}}
Pasted Text Context: Use the following text as additional context. This could be keywords, a rough draft, or notes.
\`\`\`
{{{pastedText}}}
\`\`\`
{{/if}}

Generate the complete outline now.
`,
});

const generateArticleOutlineFlow = ai.defineFlow(
  {
    name: 'generateArticleOutlineFlow',
    inputSchema: GenerateArticleOutlineInputSchema,
    outputSchema: GenerateArticleOutlineOutputSchema,
  },
  async (input) => {
    // In a real implementation, if a URL is provided, you might first fetch
    // and extract the main content from that URL to provide cleaner context to the LLM.
    // For this example, we'll pass the URL directly.
    const { output } = await prompt(input);
    return output!;
  }
);
