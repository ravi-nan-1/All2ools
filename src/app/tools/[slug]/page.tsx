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

  // Specific SEO for the new tool
  if (tool.slug === 'ai-tax-deduction-finder') {
    return {
      title: 'AI Tax Deduction Finder – Free Online Tax Saving Tool',
      description: 'Analyze income & expenses to detect legal tax deductions worldwide.',
    };
  }

  try {
    const { seoTitle, seoDescription } = await generateSEOMetadata({
      toolName: tool.name,
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
  let faqContent = '';
  // Generate FAQ with 6 questions for the new tool
  if (tool.slug === 'ai-tax-deduction-finder') {
    faqContent = [
      '1. Is this tool a replacement for a professional tax advisor? \nNo, this tool provides informational suggestions and is not a substitute for professional tax advice. Always consult a qualified accountant.',
      '2. Is my financial data secure? \nWe do not store any of the financial data you enter. All analysis happens in real-time.',
      '3. Which countries does this tool support? \nOur AI has knowledge of tax laws from many countries, including the US, UK, Canada, Australia, Germany, and India. Always verify with local regulations.',
      '4. Can I use this for my small business? \nYes, this tool is designed for individuals, freelancers, and small businesses to identify common deductions.',
      '5. What if I forget a category tag? \nThe AI can infer some deductions from your income and expense ratio, but more detailed tags provide more accurate suggestions.',
      '6. Does uploading receipts improve accuracy? \nYes, receipt data (a feature coming soon) will allow the AI to find more specific and less common deductions based on individual line items.'
    ].join('\n\n');
  }


  try {
    aiContent = await generateSEOMetadata({
      toolName: tool.name,
      toolDescription: tool.longDescription,
    });
    if (faqContent) { // Overwrite FAQ for the new tool
        aiContent.faqContent = faqContent;
    }
  } catch (error) {
    console.error('AI content generation failed, using fallback:', error);
    aiContent = {
      seoTitle: tool.name,
      seoDescription: tool.description,
      jsonLdSchema: '{}',
      faqContent: faqContent || 'FAQs could not be generated at this time.',
    };
  }
  
  if (tool.slug === 'ai-tax-deduction-finder' && aiContent.jsonLdSchema === '{}') {
      const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: "AI Tax Deduction Finder",
        description: "Analyze income & expenses to detect legal tax deductions worldwide.",
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Any',
        offers: {
            '@type': 'Offer',
            'price': '0'
        }
      };
      aiContent.jsonLdSchema = JSON.stringify(jsonLd, null, 2);
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
