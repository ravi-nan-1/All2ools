import { tools } from '@/lib/tools';
import { notFound } from 'next/navigation';
import * as icons from 'lucide-react';
import { generateSEOMetadata } from '@/ai/flows/generate-seo-metadata';
import { ToolPageClient } from '@/components/tool-page/tool-page-client';
import { translations } from '@/lib/translations';
import type { Metadata } from 'next';
import { placeholderImages } from '@/lib/placeholder-images';

type ToolPageProps = {
  params: {
    slug: string;
  };
};

export async function generateMetadata({
  params,
}: ToolPageProps): Promise<Metadata> {
  const tool = tools.find((t) => t.slug === params.slug);

  if (!tool) {
    return {
      title: 'Tool not found',
    };
  }

  try {
    const { seoTitle, seoDescription } = await generateSEOMetadata({
      toolDescription: tool.longDescription,
    });
    return {
      title: seoTitle,
      description: seoDescription,
    };
  } catch (error) {
    console.error('AI metadata generation failed, using fallback:', error);
    return {
      title: tool.name,
      description: tool.description,
    };
  }
}

export function generateStaticParams() {
  return tools.map((tool) => ({
    slug: tool.slug,
  }));
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { slug } = params;
  const tool = tools.find((t) => t.slug === slug);

  if (!tool) {
    notFound();
  }

  let aiContent;
  try {
    aiContent = await generateSEOMetadata({
      toolDescription: tool.longDescription,
    });
  } catch (error) {
    console.error('AI content generation failed, using fallback:', error);
    aiContent = {
      seoTitle: tool.name,
      seoDescription: tool.description,
      jsonLdSchema: '{}',
      faqContent: 'FAQs could not be generated at this time.',
    };
  }

  const image = placeholderImages.find((img) => img.id === tool.slug);
  const toolWithImage = {
    ...tool,
    image: image?.imageUrl || `https://picsum.photos/seed/${tool.slug}/1200/400`,
    imageHint: image?.imageHint || 'tool banner',
  };
  
  const { icon, ...rest } = toolWithImage;

  return (
    <ToolPageClient
      tool={{...rest, icon: tool.icon}}
      aiContent={aiContent}
      translations={translations}
    />
  );
}
