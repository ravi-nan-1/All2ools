'use server';
/**
 * @fileOverview A Genkit flow that generates plausible financial data from a natural language prompt.
 *
 * - generateFinancialsFromPrompt - A function that takes a user prompt and returns structured financial data.
 * - GenerateFinancialsInput - The input type for the generateFinancialsFromPrompt function.
 * - GenerateFinancialsOutput - The return type for the generateFinancialsFromPrompt function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateFinancialsInputSchema = z.object({
  prompt: z.string().describe('A natural language description of the business to be valued.'),
});
export type GenerateFinancialsInput = z.infer<typeof GenerateFinancialsInputSchema>;

const GenerateFinancialsOutputSchema = z.object({
    revenue: z.coerce.number().describe("A plausible annual revenue in USD for this type of business, between 10,000 and 10,000,000."),
    opex: z.coerce.number().describe("A plausible annual operating expense (excluding owner's salary and depreciation). This should be a realistic fraction of the revenue."),
    depreciation: z.coerce.number().describe("A plausible annual depreciation and amortization amount."),
    capex: z.coerce.number().describe("A plausible annual capital expenditure amount."),
    workingCapitalChange: z.coerce.number().describe("A plausible annual change in working capital."),
    taxRate: z.coerce.number().min(15).max(35).describe("A plausible corporate tax rate percentage."),
    growthRate: z.coerce.number().min(-10).max(50).describe("A plausible short-term annual growth rate percentage."),
    discountRate: z.coerce.number().min(8).max(25).describe("A plausible discount rate (WACC) percentage for this type of business."),
    ownerSalary: z.coerce.number().optional().describe("A plausible owner's salary, if applicable."),
    addBacks: z.coerce.number().optional().describe("Plausible discretionary expenses or add-backs."),
    totalAssets: z.coerce.number().optional().describe("A plausible total asset value for the business."),
    totalLiabilities: z.coerce.number().optional().describe("A plausible total liability value for the business."),
});
export type GenerateFinancialsOutput = z.infer<typeof GenerateFinancialsOutputSchema>;


export async function generateFinancialsFromPrompt(input: GenerateFinancialsInput): Promise<GenerateFinancialsOutput> {
  return generateFinancialsFlow(input);
}

const generateFinancialsPrompt = ai.definePrompt({
  name: 'generateFinancialsPrompt',
  input: { schema: GenerateFinancialsInputSchema },
  output: { schema: GenerateFinancialsOutputSchema },
  prompt: `You are an expert business analyst. A user will provide a prompt describing a business. Your task is to parse the user's prompt and generate a structured JSON object with plausible financial data for that business.

- If the user provides specific numbers (e.g., "$500k revenue"), use those numbers.
- If the user provides a general description (e.g., "a small coffee shop"), generate realistic and plausible numbers for all fields.
- Make sure the generated numbers are internally consistent (e.g., opex should be less than revenue).

User Prompt:
{{{prompt}}}
`,
});

const generateFinancialsFlow = ai.defineFlow(
  {
    name: 'generateFinancialsFlow',
    inputSchema: GenerateFinancialsInputSchema,
    outputSchema: GenerateFinancialsOutputSchema,
  },
  async input => {
    const { output } = await generateFinancialsPrompt(input);
    return output!;
  }
);
