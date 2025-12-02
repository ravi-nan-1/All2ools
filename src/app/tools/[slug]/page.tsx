
import { tools } from '@/lib/tools';
import { notFound } from 'next/navigation';
import { generateSEOMetadata } from '@/ai/flows/generate-seo-metadata';
import { ToolPageClient } from '@/components/tool-page/tool-page-client';
import { translations } from '@/lib/translations';
import type { Metadata } from 'next';
import { placeholderImages } from '@/lib/placeholder-images';

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

export async function generateStaticParams() {
  // These pages have their own dedicated page.tsx files
  const excludedSlugs = new Set([
    'ai-humanizer',
    'tinyurl-maker',
    'ai-product-background-remover',
    'content-gap-analyzer',
    'api-latency-checker',
    'pdf-to-word-converter',
    'ai-tutor',
    'excel-power-tools',
    'image-compressor',
    'jwt-decoder-validator',
    'global-loan-optimizer',
    'crypto-tax-calculator',
    'forex-arbitrage-checker',
    'ai-invoice-generator',
    'business-valuation-calculator',
    'ai-headshot-generator',
    'keyword-cluster-generator',
    'ai-product-description-generator',
    'json-excel-converter',
    'regex-generator-from-text',
    'webhook-tester',
    '1-click-article-outline-generator',
    'invoice-excel-extractor',
  ]);

  return tools
    .filter((tool) => !excludedSlugs.has(tool.slug))
    .map((tool) => ({
      slug: tool.slug,
    }));
}
