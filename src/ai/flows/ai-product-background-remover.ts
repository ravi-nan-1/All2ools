'use server';
/**
 * @fileOverview An AI-powered tool to remove backgrounds from product images.
 *
 * - removeBackground - A function that removes the background from a product image.
 * - RemoveBackgroundInput - The input type for the removeBackground function.
 * - RemoveBackgroundOutput - The return type for the removeBackground function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RemoveBackgroundInputSchema = z.object({
  productPhotoDataUri: z
    .string()
    .describe(
      "A photo of a product, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type RemoveBackgroundInput = z.infer<typeof RemoveBackgroundInputSchema>;

const RemoveBackgroundOutputSchema = z.object({
  backgroundRemovedPhotoDataUri: z
    .string()
    .describe('The product photo with the background removed, as a data URI.'),
});
export type RemoveBackgroundOutput = z.infer<typeof RemoveBackgroundOutputSchema>;

export async function removeBackground(input: RemoveBackgroundInput): Promise<RemoveBackgroundOutput> {
  return removeBackgroundFlow(input);
}

const prompt = ai.definePrompt({
  name: 'removeBackgroundPrompt',
  input: {schema: RemoveBackgroundInputSchema},
  output: {schema: RemoveBackgroundOutputSchema},
  prompt: `You are an AI that removes the background from a product photo.

  Remove the background from the product photo provided. Return the image as a data URI.

  Product Photo: {{media url=productPhotoDataUri}}
  `,
});

const removeBackgroundFlow = ai.defineFlow(
  {
    name: 'removeBackgroundFlow',
    inputSchema: RemoveBackgroundInputSchema,
    outputSchema: RemoveBackgroundOutputSchema,
  },
  async input => {
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.5-flash-image-preview',
      prompt: [
        {media: {url: input.productPhotoDataUri}},
        {text: 'remove the background from this product photo'},
      ],
      config: {
        responseModalities: ['TEXT', 'IMAGE'], // MUST provide both TEXT and IMAGE, IMAGE only won't work
      },
    });
    return {backgroundRemovedPhotoDataUri: media.url!};
  }
);
