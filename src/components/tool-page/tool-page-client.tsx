"use client";

import type { Tool } from '@/lib/tools';
import type { GenerateSEOMetadataOutput } from '@/ai/flows/generate-seo-metadata';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/hooks/use-language';
import { LanguageSwitcher } from './language-switcher';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, CheckCircle2, List, CaseSensitive, HelpCircle, ArrowRight } from 'lucide-react';
import { ToolInterface } from './tool-interface';
import { AdBanner } from '@/components/shared/ad-banner';

interface ToolPageClientProps {
  tool: Tool & { image: string; imageHint: string };
  aiContent: GenerateSEOMetadataOutput;
  translations: Record<string, Record<string, string>>;
}

export function ToolPageClient({ tool, aiContent, translations }: ToolPageClientProps) {
  const { translate, language } = useLanguage();
  const { jsonLdSchema, faqContent } = aiContent;

  const currentDescription = language === 'en' ? tool.longDescription : (translations[language]?.[`${tool.slug}-longDesc`] || tool.longDescription);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdSchema }}
      />
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="flex justify-between items-start mb-6">
          <Button variant="ghost" asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {translate('back_to_tools')}
            </Link>
          </Button>
          <LanguageSwitcher />
        </div>

        <header className="relative w-full h-48 md:h-64 rounded-xl overflow-hidden mb-8 shadow-lg">
           <Image
            src={tool.image}
            alt={`${tool.name} banner`}
            fill
            className="object-cover"
            priority
            data-ai-hint={tool.imageHint}
          />
           <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-4">
            <h1 className="text-3xl md:text-5xl font-bold text-white text-center font-headline tracking-tight">
              {translate(tool.slug)}
            </h1>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>{translate(tool.slug)}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-line">{currentDescription}</p>
              </CardContent>
            </Card>

            <ToolInterface slug={tool.slug} />

            <Card>
              <CardHeader>
                 <CardTitle className="flex items-center gap-2">
                    <HelpCircle className="text-primary"/>
                    {translate('faq')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-sm text-muted-foreground bg-muted p-4 rounded-md whitespace-pre-wrap font-body">{faqContent}</pre>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8 sticky top-24">
            <AdBanner adSlot="YOUR_SIDE_BANNER_AD_SLOT_ID" className="w-full min-h-[250px] bg-muted rounded-lg mb-8 hidden lg:flex items-center justify-center" />
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="text-primary"/>
                    {translate('features')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-muted-foreground">
                  {tool.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mt-1 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                 <CardTitle className="flex items-center gap-2">
                    <List className="text-primary"/>
                    {translate('how_it_works')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-3 text-muted-foreground">
                    {tool.howItWorks.map((step, index) => (
                        <li key={index} className="flex items-start gap-3">
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-sm shrink-0 mt-0.5">{index + 1}</span>
                            <span>{step}</span>
                        </li>
                    ))}
                </ol>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                 <CardTitle className="flex items-center gap-2">
                    <CaseSensitive className="text-primary"/>
                    {translate('use_cases')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-muted-foreground">
                  {tool.useCases.map((useCase, index) => (
                    <li key={index} className="flex items-start gap-2">
                       <ArrowRight className="h-4 w-4 text-primary mt-1.5 shrink-0" />
                      <span>{useCase}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
