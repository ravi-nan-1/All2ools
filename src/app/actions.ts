"use server";

import { removeBackground } from "@/ai/flows/ai-product-background-remover";
import { analyzeContentGap } from "@/ai/flows/analyze-content-gap";
import { translateContent } from "@/ai/flows/translate-content";
import { translatePageContent } from "@/ai/flows/translate-page-content";
import { z } from 'zod';

export const PageContentSchema = z.object({
  description: z.string().describe('The main description of the tool.'),
  faq: z.string().describe('The Frequently Asked Questions content.'),
  features: z.array(z.string()).describe('A list of tool features.'),
  howItWorks: z.array(z.string()).describe('A list of steps explaining how the tool works.'),
  useCases: z.array(z.string()).describe('A list of common use cases for the tool.'),
});
export type PageContent = z.infer<typeof PageContentSchema>;


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
      throw new Error('No image file provided.');
    }

    const productPhotoDataUri = await fileToDataUri(imageFile);
    const result = await removeBackground({ productPhotoDataUri });
    return result;
  } catch (error: any) {
    return { error: error.message || 'Failed to remove background.' };
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


export async function handlePageTranslation(content: PageContent, targetLanguage: string) {
  try {
    if (!content) {
      throw new Error('No content object provided for translation.');
    }
    const result = await translatePageContent({ content, targetLanguage });
    return { data: result };
  } catch (error: any) {
    return { error: error.message || 'Failed to translate page content.' };
  }
}
