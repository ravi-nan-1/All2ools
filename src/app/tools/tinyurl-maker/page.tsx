import { tools } from '@/lib/tools';
import { notFound } from 'next/navigation';
import { generateSEOMetadata } from '@/ai/flows/generate-seo-metadata';
import { ToolPageClient } from '@/components/tool-page/tool-page-client';
import { translations } from '@/lib/translations';
import type { Metadata } from 'next';
import { placeholderImages } from '@/lib/placeholder-images';

const SLUG = 'tinyurl-maker';

export async function generateMetadata(): Promise<Metadata> {
  const tool = tools.find((t) => t.slug === SLUG);

  if (!tool) {
    return {
      title: 'Tool not found',
    };
  }

  const { seoTitle, seoDescription } = await generateSEOMetadata({
    toolName: tool.name,
    toolDescription: tool.longDescription,
  });

  return {
    title: 'TinyURL Maker – Free URL Shortener Tool',
    description: 'Create clean, fast, trackable short links instantly.',
    openGraph: {
      title: 'TinyURL Maker – Free URL Shortener Tool',
      description: 'Create clean, fast, trackable short links instantly.',
      type: 'website',
      url: `https://all2ools.com/tools/tinyurl-maker`,
    },
  };
}

export default async function ToolPage() {
  const tool = tools.find((t) => t.slug === SLUG);

  if (!tool) {
    notFound();
  }
  
  const faqContent = [
      '1. Is this URL shortener free to use? \nYes, this tool is completely free to use. There are no hidden charges or subscription fees.',
      '2. Do the shortened links expire? \nNo, the links you create with our tool do not expire. They will continue to work indefinitely.',
      '3. Can I customize the shortened URL? \nYes, you can use the "Custom Slug" field to create a personalized, branded short link that is easy to remember.',
      '4. Is my data and privacy secure? \nWe do not store any personal data associated with the links you create. The history of your last 5 links is stored locally on your device\'s browser and is not sent to our servers.',
      '5. What kind of analytics do you provide? \nWe provide basic, privacy-friendly analytics, including the total number of clicks a link has received and the timestamp of the last click. We do not track individual users.',
      '6. Can I use this for commercial purposes? \nAbsolutely. You are free to use the shortened links for your business, marketing campaigns, or any other commercial activity.'
    ].join('\n\n');
    
  let aiContent = await generateSEOMetadata({
    toolName: tool.name,
    toolDescription: tool.longDescription,
  });

  aiContent.faqContent = faqContent;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'TinyURL Maker – Free URL Shortener',
    description: 'Create clean, fast, trackable short links instantly.',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Any',
    url: 'https://all2ools.com/tools/tinyurl-maker',
    offers: {
      '@type': 'Offer',
      price: '0',
    },
  };
  aiContent.jsonLdSchema = JSON.stringify(jsonLd, null, 2);

  const image = placeholderImages.find((img) => img.id === tool.slug);
  const toolWithImage = {
    ...tool,
    image: image?.imageUrl || `https://picsum.photos/seed/${tool.slug}/1200/400`,
    imageHint: image?.imageHint || 'tool banner',
  };

  const { icon, ...rest } = toolWithImage;

  return (
    <ToolPageClient
      tool={{ ...rest, icon: tool.icon }}
      aiContent={aiContent}
      translations={translations}
    />
  );
}
