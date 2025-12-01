
'use server';
/**
 * @fileOverview A Genkit flow for generating regular expressions from sample text.
 *
 * - generateRegexFromText - A function that takes sample text and options and returns a regex pattern and explanation.
 * - GenerateRegexInput - The input type for the function.
 * - GenerateRegexOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

export const GenerateRegexInputSchema = z.object({
  sampleText: z.string().describe('A piece of sample text that contains the pattern to be matched.'),
  isCaseSensitive: z.boolean().describe('Whether the regex should be case-sensitive.'),
  isGlobal: z.boolean().describe('Whether the regex should find all matches (global) or just the first one.'),
  isMultiline: z.boolean().describe('Whether the regex should support multi-line matching (^ and $ match start/end of line).'),
});
export type GenerateRegexInput = z.infer<typeof GenerateRegexInputSchema>;

export const GenerateRegexOutputSchema = z.object({
  regex: z.string().describe('The generated regular expression pattern, enclosed in slashes (e.g., `/[a-z]+/`).'),
  explanation: z.string().describe('A step-by-step, human-readable explanation of how the regex works. Use HTML formatting with bold tags for regex parts and code tags for examples.'),
  sampleMatches: z.array(z.string()).describe('An array of 2-3 sample strings that WOULD match the generated regex.'),
  sampleNonMatches: z.array(z.string()).describe('An array of 2-3 sample strings that WOULD NOT match the generated regex.'),
});
export type GenerateRegexOutput = z.infer<typeof GenerateRegexOutputSchema>;

export async function generateRegexFromText(input: GenerateRegexInput): Promise<GenerateRegexOutput> {
  return generateRegexFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateRegexPrompt',
  input: { schema: GenerateRegexInputSchema },
  output: { schema: GenerateRegexOutputSchema },
  prompt: `You are a regex expert. A user will provide sample text and some options. Your task is to generate the best possible regular expression to match the clear pattern in the text. You must also provide a detailed, human-readable explanation and sample strings that would and would not match.

Context & Rules:
- Analyze the sample text to identify the most likely pattern the user wants to extract.
- The generated regex must be a valid JavaScript regular expression.
- The explanation should break down each part of the regex and explain its purpose clearly. Use <b>tags for regex parts and <code>tags for examples.
- Generate 2-3 creative but realistic examples of strings that would match, and 2-3 examples that would not match.

Sample Text:
\`\`\`
{{{sampleText}}}
\`\`\`

Regex Options:
- Case Sensitive: {{{isCaseSensitive}}}
- Global Match: {{{isGlobal}}}
- Multi-line Mode: {{{isMultiline}}}

Generate the regex, a helpful explanation, and sample matches/non-matches based on this input.
`,
});

const generateRegexFlow = ai.defineFlow(
  {
    name: 'generateRegexFlow',
    inputSchema: GenerateRegexInputSchema,
    outputSchema: GenerateRegexOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);


// New flow for describing regex
export const DescribeRegexInputSchema = z.object({
    regex: z.string().describe('A regular expression string.'),
});
export type DescribeRegexInput = z.infer<typeof DescribeRegexInputSchema>;

export const DescribeRegexOutputSchema = z.object({
    explanation: z.string().describe('A detailed, human-readable explanation of the provided regex. Use HTML formatting.'),
});
export type DescribeRegexOutput = z.infer<typeof DescribeRegexOutputSchema>;

export async function describeRegex(input: DescribeRegexInput): Promise<DescribeRegexOutput> {
    return describeRegexFlow(input);
}

const describeRegexPrompt = ai.definePrompt({
    name: 'describeRegexPrompt',
    input: { schema: DescribeRegexInputSchema },
    output: { schema: DescribeRegexOutputSchema },
    prompt: `You are a regex expert. A user will provide a regular expression. Your task is to provide a detailed, step-by-step, human-readable explanation of what it does.

- Break down each component of the regex (e.g., characters, quantifiers, groups, anchors).
- Explain its purpose clearly.
- Use <b>tags for regex parts and <code>tags for examples.

Regex to explain:
\`\`\`
{{{regex}}}
\`\`\`
`,
});

const describeRegexFlow = ai.defineFlow(
  {
    name: 'describeRegexFlow',
    inputSchema: DescribeRegexInputSchema,
    outputSchema: DescribeRegexOutputSchema,
  },
  async (input) => {
    const { output } = await describeRegexPrompt(input);
    return output!;
  }
);
