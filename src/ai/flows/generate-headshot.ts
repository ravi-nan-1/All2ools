'use server';
/**
 * @fileOverview An AI-powered tool to generate professional headshots from selfies.
 *
 * - generateHeadshot - A function that transforms a selfie into a professional headshot.
 * - GenerateHeadshotInput - The input type for the generateHeadshot function.
 * - GenerateHeadshotOutput - The return type for the generateHeadshot function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateHeadshotInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A selfie photo, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  style: z
    .string()
    .describe(
      'A description of the desired headshot style (e.g., "professional corporate", "creative black and white").'
    ),
});
export type GenerateHeadshotInput = z.infer<typeof GenerateHeadshotInputSchema>;

const GenerateHeadshotOutputSchema = z.object({
  generatedHeadshotDataUri: z
    .string()
    .describe('The generated professional headshot, as a data URI.'),
});
export type GenerateHeadshotOutput = z.infer<
  typeof GenerateHeadshotOutputSchema
>;

export async function generateHeadshot(
  input: GenerateHeadshotInput
): Promise<GenerateHeadshotOutput> {
  return generateHeadshotFlow(input);
}

const generateHeadshotFlow = ai.defineFlow(
  {
    name: 'generateHeadshotFlow',
    inputSchema: GenerateHeadshotInputSchema,
    outputSchema: GenerateHeadshotOutputSchema,
  },
  async (input) => {
    const { media } = await ai.generate({
      model: 'googleai/gemini-2.5-flash-image-preview',
      prompt: [
        { media: { url: input.photoDataUri } },
        {
          text: `Transform this user-provided selfie into a high-quality, professional headshot. The generated image should maintain the user's likeness, facial features, and expression, but enhance the overall quality to be suitable for a professional context like a LinkedIn profile.

Apply the following style: "${input.style}".

Specific instructions:
- Do not change the person's identity, age, or ethnicity.
- Replace the existing background with one that matches the requested style.
- Adjust the clothing to be professional and appropriate for the style (e.g., a suit for corporate, a simple blouse for creative).
- Improve the lighting to be flattering and professional (e.g., studio lighting).
- Perform subtle skin retouching to remove temporary blemishes, but do not alter core facial features.
- The final image should be a realistic, photorealistic headshot, not a cartoon or avatar.
- The output image must be a clear, high-resolution portrait.`,
        },
      ],
      config: {
        responseModalities: ['IMAGE', 'TEXT'],
      },
    });

    if (!media?.url) {
      throw new Error('AI model did not return an image.');
    }

    return { generatedHeadshotDataUri: media.url };
  }
);
