'use server';
/**
 * @fileOverview A Genkit flow that generates invoice data from a natural language prompt.
 *
 * - generateInvoiceFromPrompt - A function that takes a user prompt and returns structured invoice data.
 * - GenerateInvoiceInput - The input type for the generateInvoiceFromPrompt function.
 * - GenerateInvoiceOutput - The return type for the generateInvoiceFromPrompt function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateInvoiceInputSchema = z.object({
  prompt: z.string().describe('A natural language description of the invoice to be created.'),
});
export type GenerateInvoiceInput = z.infer<typeof GenerateInvoiceInputSchema>;

const LineItemSchema = z.object({
  description: z.string().describe('A plausible, brief description of the service or product.'),
  hsn: z.string().optional().describe('An 8-digit plausible HSN or SAC code.'),
  quantity: z.number().describe('A plausible quantity for the item, typically between 1 and 20.'),
  rate: z.number().describe('A plausible price for a single unit of the item, between 10 and 500.'),
});

const GenerateInvoiceOutputSchema = z.object({
  billTo: z.string().describe("The name and address of the person or company being billed. If a name is in the prompt, use it. Otherwise, generate a plausible name and address."),
  lineItems: z.array(LineItemSchema).describe('An array of line items for the invoice. The number of items should match what is requested in the prompt. If no number is specified, generate between 2 and 5 items.'),
  notes: z.string().optional().describe('A short, friendly note to the client.'),
  tax: z.number().optional().describe('A plausible tax percentage, between 5 and 18.'),
  discount: z.number().optional().describe('A plausible discount percentage, between 0 and 15.'),
  shipping: z.number().optional().describe('A plausible shipping cost, between 10 and 100.'),
});
export type GenerateInvoiceOutput = z.infer<typeof GenerateInvoiceOutputSchema>;

export async function generateInvoiceFromPrompt(input: GenerateInvoiceInput): Promise<GenerateInvoiceOutput> {
  return generateInvoiceFlow(input);
}

const generateInvoicePrompt = ai.definePrompt({
  name: 'generateInvoicePrompt',
  input: { schema: GenerateInvoiceInputSchema },
  output: { schema: GenerateInvoiceOutputSchema },
  prompt: `You are an expert invoicing assistant. A user will provide a prompt to create an invoice. Your task is to parse the user's prompt and generate a structured JSON object representing the invoice.

- Pay close attention to the number of items requested in the prompt. For example, if the user says "for 13 items", you MUST generate exactly 13 line items. If no number is given, generate a random number of items between 2 and 5.
- If a name is mentioned (e.g., "for John"), use that name in the 'billTo' field.
- Generate plausible, creative, and varied descriptions, quantities, and rates for each line item.
- Generate plausible values for tax, discount, and shipping.

User Prompt:
{{{prompt}}}
`,
});

const generateInvoiceFlow = ai.defineFlow(
  {
    name: 'generateInvoiceFlow',
    inputSchema: GenerateInvoiceInputSchema,
    outputSchema: GenerateInvoiceOutputSchema,
  },
  async input => {
    const { output } = await generateInvoicePrompt(input);
    return output!;
  }
);
