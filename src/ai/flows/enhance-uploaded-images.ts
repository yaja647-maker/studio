'use server';

/**
 * @fileOverview Enhances uploaded logistics-related images using AI to improve their visual quality and appeal.
 *
 * - enhanceImage - A function that handles the image enhancement process.
 * - EnhanceImageInput - The input type for the enhanceImage function.
 * - EnhanceImageOutput - The return type for the enhanceImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EnhanceImageInputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      'The image to enhance, as a data URI that must include a MIME type and use Base64 encoding. Expected format: data:<mimetype>;base64,<encoded_data>.'
    ),
});
export type EnhanceImageInput = z.infer<typeof EnhanceImageInputSchema>;

const EnhanceImageOutputSchema = z.object({
  enhancedImageDataUri: z
    .string()
    .describe('The enhanced image, as a data URI in base64 format.'),
});
export type EnhanceImageOutput = z.infer<typeof EnhanceImageOutputSchema>;

export async function enhanceImage(input: EnhanceImageInput): Promise<EnhanceImageOutput> {
  return enhanceImageFlow(input);
}

const enhanceImagePrompt = ai.definePrompt({
  name: 'enhanceImagePrompt',
  input: {schema: EnhanceImageInputSchema},
  output: {schema: EnhanceImageOutputSchema},
  prompt: [
    {media: {url: '{{imageDataUri}}'}},
    {
      text:
        'Enhance the image to improve its visual quality and appeal. Focus on improving details, sharpness, and overall aesthetic. Return only the base64 encoded data URI of the enhanced image.',
    },
  ],
  model: 'googleai/gemini-2.5-flash-image-preview',
  config: {
    responseModalities: ['TEXT', 'IMAGE'],
  },
});

const enhanceImageFlow = ai.defineFlow(
  {
    name: 'enhanceImageFlow',
    inputSchema: EnhanceImageInputSchema,
    outputSchema: EnhanceImageOutputSchema,
  },
  async input => {
    const {media} = await ai.generate(enhanceImagePrompt.configFromInput(input));
    return {enhancedImageDataUri: media!.url!};
  }
);
