'use server';
/**
 * @fileOverview An AI flow to analyze user financial data and identify potential tax deductions.
 *
 * - findTaxDeductions - A function that analyzes income, expenses, country, and categories to suggest tax deductions.
 * - FindTaxDeductionsInput - The input type for the findTaxDeductions function.
 * - FindTaxDeductionsOutput - The return type for the findTaxDeductions function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const FindTaxDeductionsInputSchema = z.object({
  income: z.number().describe('The user\'s total annual income in their local currency.'),
  expenses: z.number().describe('The user\'s total annual expenses in their local currency.'),
  country: z.string().describe('The user\'s country of residence for tax purposes.'),
  categoryTags: z.string().describe('A comma-separated list of expense categories (e.g., home office, travel, software).'),
});
export type FindTaxDeductionsInput = z.infer<typeof FindTaxDeductionsInputSchema>;

const FindTaxDeductionsOutputSchema = z.object({
  estimatedSavings: z.string().describe('An estimated amount of tax savings in the local currency. Should be a formatted string (e.g., ~$1,250 USD).'),
  deductionList: z.string().describe('A bulleted or numbered list of potential tax deductions based on the input.'),
  documentsNeeded: z.string().describe('A bulleted or numbered list of documents typically needed to claim these deductions.'),
  tips: z.string().describe('A bulleted or numbered list of actionable tips for future tax optimization.'),
});
export type FindTaxDeductionsOutput = z.infer<typeof FindTaxDeductionsOutputSchema>;

export async function findTaxDeductions(input: FindTaxDeductionsInput): Promise<FindTaxDeductionsOutput> {
  return findTaxDeductionsFlow(input);
}

const taxDeductionPrompt = ai.definePrompt({
  name: 'findTaxDeductionsPrompt',
  input: { schema: FindTaxDeductionsInputSchema },
  output: { schema: FindTaxDeductionsOutputSchema },
  system: `You are an expert tax advisor with global knowledge. Your task is to analyze financial information and provide potential tax deductions. Be clear, concise, and provide actionable advice. Always include a disclaimer that you are an AI and a professional should be consulted.`,
  prompt: `A user from {{{country}}} has provided their financial details. Analyze them to identify potential tax deductions.

User's Financial Information:
- Annual Income: {{{income}}}
- Annual Expenses: {{{expenses}}}
- Expense Categories: {{{categoryTags}}}

Based on this, provide the following:
1.  **estimatedSavings**: A rough estimate of their potential tax savings. Format it clearly (e.g., "~$1,250 USD" or "~€800 EUR").
2.  **deductionList**: A list of specific deductions they might be eligible for.
3.  **documentsNeeded**: A list of common documents required to claim these deductions.
4.  **tips**: Actionable tips for maximizing deductions next year.

IMPORTANT: Conclude your entire response with the disclaimer: "Disclaimer: I am an AI assistant. This information is for informational purposes only and does not constitute professional tax advice. Please consult with a qualified tax professional."
`,
});

const findTaxDeductionsFlow = ai.defineFlow(
  {
    name: 'findTaxDeductionsFlow',
    inputSchema: FindTaxDeductionsInputSchema,
    outputSchema: FindTaxDeductionsOutputSchema,
  },
  async (input) => {
    const { output } = await taxDeductionPrompt(input);
    if (!output) {
        throw new Error("The AI failed to generate a response for tax deductions.");
    }
    return output;
  }
);
