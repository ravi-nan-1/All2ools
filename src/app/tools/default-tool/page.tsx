import { tools } from '@/lib/tools';
import { notFound } from 'next/navigation';
import { generateSEOMetadata } from '@/ai/flows/generate-seo-metadata';
import { ToolPageClient } from '@/components/tool-page/tool-page-client';
import { translations } from '@/lib/translations';
import type { Metadata } from 'next';
import { placeholderImages } from '@/lib/placeholder-images';

export default async function ToolPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  const tool = tools.find((t) => t.slug === slug);

  if (!tool) {
    notFound();
  }

  let aiContent = await generateSEOMetadata({
    toolName: tool.name,
    toolDescription: tool.longDescription,
  });

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

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const tool = tools.find((t) => t.slug === params.slug);

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
    title: seoTitle,
    description: seoDescription,
  };
}
