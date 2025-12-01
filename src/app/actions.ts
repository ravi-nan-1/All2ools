
"use server";

import { z } from 'zod';
import { removeBackground } from "@/ai/flows/ai-product-background-remover";
import { analyzeContentGap } from "@/ai/flows/analyze-content-gap";
import { translateContent } from "@/ai/flows/translate-content";
import { generateInvoiceFromPrompt } from "@/ai/flows/generate-invoice-from-prompt";
import { generateFinancialsFromPrompt } from "@/ai/flows/generate-financials-from-prompt";
import { generateHeadshot } from '@/ai/flows/generate-headshot';
import { generateKeywordClusters } from '@/ai/flows/generate-keyword-clusters';
import { generateProductDescription, GenerateProductDescriptionInputSchema } from '@/ai/flows/generate-product-description';


async function fileToDataUri(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const base64 = buffer.toString('base64');
  return `data:${file.type};base64,${base64}`;
}

export async function handleBackgroundRemoval(formData: FormData) {
  try {
    const imageFile = formData.get('image') as File;
    if (!imageFile) {
      return { error: 'No image file provided.' };
    }

    // Add a size check
    if (imageFile.size > 4 * 1024 * 1024) { // 4MB limit
        return { error: 'Image file is too large. Please use a file under 4MB.' };
    }

    const productPhotoDataUri = await fileToDataUri(imageFile);
    const result = await removeBackground({ productPhotoDataUri });
    return result;
  } catch (error: any) {
    console.error('Background removal action error:', error);
    if (error.message.includes('upstream')) {
        return { error: 'The AI service is currently unavailable. Please try again later.' };
    }
    return { error: error.message || 'An unexpected error occurred during background removal.' };
  }
}

export async function handleContentAnalysis(formData: FormData) {
  try {
    const text = formData.get('text') as string;
    if (!text) {
      throw new Error('No text provided.');
    }
    
    const competitorUrls = formData.getAll('competitorUrls') as string[];
    const validUrls = competitorUrls.filter(url => url.trim() !== '');

    if (validUrls.length === 0) {
        throw new Error('No competitor URLs provided.');
    }
    
    for (const url of validUrls) {
      try {
        new URL(url);
      } catch (_) {
        throw new Error(`Invalid URL format: ${url}`);
      }
    }
    
    const result = await analyzeContentGap({ text, competitorUrls: validUrls });
    return result;
  } catch (error: any) {
    return { error: error.message || 'Failed to analyze content.' };
  }
}

// This is a simplified version. A real-world implementation would use distributed workers.
const regions = [
  { name: 'US East (N. Virginia)', flag: '🇺🇸' },
  { name: 'US West (Oregon)', flag: '🇺🇸' },
  { name: 'Europe (Ireland)', flag: '🇮🇪' },
  { name: 'Asia Pacific (Tokyo)', flag: '🇯🇵' },
  { name: 'South America (São Paulo)', flag: '🇧🇷' },
  { name: 'Australia (Sydney)', flag: '🇦🇺' },
];

export async function handleLatencyCheck(formData: FormData) {
  try {
    const url = formData.get('url') as string;
    if (!url) {
      throw new Error('No URL provided.');
    }
    
    // Validate URL
    try {
      new URL(url);
    } catch (_) {
      throw new Error('Invalid URL format.');
    }

    const promises = regions.map(async (region) => {
      try {
        const start = Date.now();
        // The fetch will originate from the server's location, not the specified region.
        // We are mocking the multi-region aspect for demonstration purposes.
        await fetch(url, { method: 'HEAD', cache: 'no-store' });
        const latency = Date.now() - start;
        // Add some random variance to simulate different regions
        const simulatedLatency = latency + Math.random() * 150;
        return { region: `${region.flag} ${region.name}`, latency: Math.round(simulatedLatency) };
      } catch (e) {
        return { region: `${region.flag} ${region.name}`, latency: 'Error' };
      }
    });

    const data = await Promise.all(promises);
    return { data };

  } catch (error: any) {
    return { error: error.message || 'Failed to check latency.' };
  }
}

export async function handleTranslation(content: string, targetLanguage: string) {
  try {
    if (!content) {
      throw new Error('No content provided for translation.');
    }
    const result = await translateContent({ content, targetLanguage });
    return result;
  } catch (error: any) {
    return { error: error.message || 'Failed to translate content.' };
  }
}

export async function handleInvoiceGeneration(prompt: string) {
    try {
        if (!prompt) {
            throw new Error('No prompt provided for invoice generation.');
        }
        const result = await generateInvoiceFromPrompt({ prompt });
        return { data: result };
    } catch (error: any) {
        return { error: error.message || 'Failed to generate invoice from prompt.' };
    }
}

export async function handleFinancialsGeneration(prompt: string) {
    try {
        if (!prompt) {
            throw new Error('No prompt provided for financials generation.');
        }
        const result = await generateFinancialsFromPrompt({ prompt });
        return { data: result };
    } catch (error: any) {
        return { error: error.message || 'Failed to generate financials from prompt.' };
    }
}

export async function handleHeadshotGeneration(formData: FormData) {
  try {
    const imageFile = formData.get('image') as File;
    const style = formData.get('style') as string;

    if (!imageFile) {
      return { error: 'No image file provided.' };
    }
     if (imageFile.size > 4 * 1024 * 1024) { // 4MB limit
        return { error: 'Image file is too large. Please use a file under 4MB.' };
    }
    if (!style) {
        return { error: 'No style selected.' };
    }

    const photoDataUri = await fileToDataUri(imageFile);
    const result = await generateHeadshot({ photoDataUri, style });
    return result;
  } catch (error: any) {
    console.error('Headshot generation action error:', error);
    if (error.message.includes('upstream')) {
        return { error: 'The AI service is currently unavailable. Please try again later.' };
    }
    return { error: error.message || 'An unexpected error occurred during headshot generation.' };
  }
}

export async function handleKeywordClusterGeneration(formData: FormData) {
    try {
        const primaryKeyword = formData.get('primaryKeyword') as string;
        const secondaryKeywords = formData.getAll('secondaryKeywords') as string[];

        if (!primaryKeyword) {
            return { error: 'Primary keyword is required.' };
        }

        const result = await generateKeywordClusters({ 
            primaryKeyword, 
            secondaryKeywords: secondaryKeywords.filter(k => k.trim() !== '')
        });
        return { data: result };
    } catch (error: any) {
        return { error: error.message || 'Failed to generate keyword clusters.' };
    }
}

export async function handleProductDescriptionGeneration(
  input: z.infer<typeof GenerateProductDescriptionInputSchema>
) {
  try {
    const validatedInput = GenerateProductDescriptionInputSchema.parse(input);
    const result = await generateProductDescription(validatedInput);
    return { data: result };
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return { error: error.errors.map((e) => e.message).join(', ') };
    }
    return {
      error:
        error.message || 'Failed to generate product descriptions from prompt.',
    };
  }
}
