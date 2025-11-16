import { tools } from '@/lib/tools';
import { notFound } from 'next/navigation';
import { generateSEOMetadata } from '@/ai/flows/generate-seo-metadata';
import { ToolPageClient } from '@/components/tool-page/tool-page-client';
import { translations } from '@/lib/translations';
import type { Metadata } from 'next';
import { placeholderImages } from '@/lib/placeholder-images';
import { permanentRedirect } from 'next/navigation';

export function generateStaticParams() {
  // We can return an empty array because we are redirecting all slugs.
  return [];
}

export default async function ToolPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  permanentRedirect(`/tools/${slug}`);
}
