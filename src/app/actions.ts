'use server';

import { enhanceImage } from '@/ai/flows/enhance-uploaded-images';

export async function enhanceImageAction(imageDataUri: string) {
  try {
    const result = await enhanceImage({ imageDataUri });
    if (result.enhancedImageDataUri) {
      return { success: true, data: result.enhancedImageDataUri };
    }
    throw new Error('Enhanced image data URI is missing');
  } catch (error) {
    console.error('Error enhancing image:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, error: `Failed to enhance image: ${errorMessage}` };
  }
}
