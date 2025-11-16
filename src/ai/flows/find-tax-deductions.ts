'use server';

/**
 * @fileOverview A Genkit flow that helps users find potential tax deductions.
 *
 * - findTaxDeductions - A function that takes user information and returns a list of potential tax deductions.
 * - FindTaxDeductionsInput - The input type for the findTaxDeductions function.
 * - FindTaxDeductionsOutput - The return type for the findTaxDeductions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FindTaxDeductionsInputSchema = z.object({
  occupation: z.string().describe('The user\'s occupation.'),
  income: z.number().describe('The user\'s annual income.'),
  expenses: z.array(z.string()).describe('A list of the user\'s expenses.'),
});
export type FindTaxDeductionsInput = z.infer<typeof FindTaxDeductionsInputSchema>;

const FindTaxDeductionsOutputSchema = z.object({
  deductions: z.array(z.object({
    deduction: z.string().describe('The name of the potential tax deduction.'),
    reasoning: z.string().describe('The reasoning for why this might be a valid deduction.'),
  })),
});
export type FindTaxDeductionsOutput = z.infer<typeof FindTaxDeductionsOutputSchema>;

export async function findTaxDeductions(input: FindTaxDeductionsInput): Promise<FindTaxDeductionsOutput> {
  return findTaxDeductionsFlow(input);
}

const findTaxDeductionsPrompt = ai.definePrompt({
  name: 'findTaxDeductionsPrompt',
  input: {schema: FindTaxDeductionsInputSchema},
  output: {schema: FindTaxDeductionsOutputSchema},
  prompt: `You are a tax expert. Based on the user's occupation, income, and expenses, identify potential tax deductions. For each deduction, provide a brief explanation.

User Occupation: {{{occupation}}}
User Income: {{{income}}}
User Expenses: {{{expenses}}}
`,
});

const findTaxDeductionsFlow = ai.defineFlow(
  {
    name: 'findTaxDeductionsFlow',
    inputSchema: FindTaxDeductionsInputSchema,
    outputSchema: FindTaxDeductionsOutputSchema,
  },
  async input => {
    const {output} = await findTaxDeductionsPrompt(input);
    return output!;
  }
);
