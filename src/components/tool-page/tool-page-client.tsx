"use client";

import type { Tool } from '@/lib/tools';
import type { GenerateSEOMetadataOutput } from '@/ai/flows/generate-seo-metadata';
import { useState, useEffect, useTransition } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/hooks/use-language';
import { LanguageSwitcher } from './language-switcher';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, CheckCircle2, List, CaseSensitive, HelpCircle, ArrowRight, Loader2 } from 'lucide-react';
import { ToolInterface } from './tool-interface';
import { AdBanner } from '@/components/shared/ad-banner';
import { handleTranslation } from '@/app/actions';
import { languages } from '@/lib/translations';

interface ToolPageClientProps {
  tool: Tool & { image: string; imageHint: string };
  aiContent: GenerateSEOMetadataOutput;
  translations: Record<string, Record<string, string>>;
}

export function ToolPageClient({ tool, aiContent }: ToolPageClientProps) {
  const { translate, language } = useLanguage();
  const { jsonLdSchema } = aiContent;

  const [isPending, startTransition] = useTransition();
  const [translatedDescription, setTranslatedDescription] = useState(tool.longDescription);
  const [translatedFaq, setTranslatedFaq] = useState(aiContent.faqContent);
  const [translatedFeatures, setTranslatedFeatures] = useState(tool.features);
  const [translatedHowItWorks, setTranslatedHowItWorks] = useState(tool.howItWorks);
  const [translatedUseCases, setTranslatedUseCases] = useState(tool.useCases);


  useEffect(() => {
    if (language === 'en') {
      setTranslatedDescription(tool.longDescription);
      setTranslatedFaq(aiContent.faqContent);
      setTranslatedFeatures(tool.features);
      setTranslatedHowItWorks(tool.howItWorks);
      setTranslatedUseCases(tool.useCases);
      return;
    }

    startTransition(async () => {
      const targetLanguageName = languages.find(l => l.code === language)?.name || 'English';
      
      const translateArray = async (arr: string[]) => {
        const results = await Promise.all(arr.map(item => handleTranslation(item, targetLanguageName)));
        return results.map(res => res.error ? '' : res.translatedContent!);
      };

      const [descResult, faqResult, featuresResult, howItWorksResult, useCasesResult] = await Promise.all([
        handleTranslation(tool.longDescription, targetLanguageName),
        handleTranslation(aiContent.faqContent, targetLanguageName),
        translateArray(tool.features),
        translateArray(tool.howItWorks),
        translateArray(tool.useCases)
      ]);

      if (!descResult.error) {
        setTranslatedDescription(descResult.translatedContent!);
      }
      if (!faqResult.error) {
        setTranslatedFaq(faqResult.translatedContent!);
      }
      setTranslatedFeatures(featuresResult);
      setTranslatedHowItWorks(howItWorksResult);
      setTranslatedUseCases(useCasesResult);
    });
  }, [language, tool.longDescription, aiContent.faqContent, tool.features, tool.howItWorks, tool.useCases]);


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
                {isPending ? (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>{translate('processing')}...</span>
                  </div>
                ) : (
                  <p className="text-muted-foreground whitespace-pre-line">{translatedDescription}</p>
                )}
              </CardContent>
            </Card>

            <ToolInterface slug={tool.slug} />

            <div className="my-8">
              <AdBanner
                adSlot="YOUR_IN_ARTICLE_AD_SLOT_ID"
                className="w-full min-h-[100px] flex items-center justify-center bg-muted rounded-lg"
              />
            </div>

            <Card>
              <CardHeader>
                 <CardTitle className="flex items-center gap-2">
                    <HelpCircle className="text-primary"/>
                    {translate('faq')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isPending ? (
                   <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>{translate('processing')}...</span>
                  </div>
                ) : (
                  <pre className="text-sm text-muted-foreground bg-muted p-4 rounded-md whitespace-pre-wrap font-body">{translatedFaq}</pre>
                )}
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
                {isPending ? (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>{translate('processing')}...</span>
                  </div>
                ) : (
                  <ul className="space-y-2 text-muted-foreground">
                    {translatedFeatures.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mt-1 shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                )}
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
                {isPending ? (
                   <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>{translate('processing')}...</span>
                  </div>
                ) : (
                  <ol className="space-y-3 text-muted-foreground">
                      {translatedHowItWorks.map((step, index) => (
                          <li key={index} className="flex items-start gap-3">
                              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-sm shrink-0 mt-0.5">{index + 1}</span>
                              <span>{step}</span>
                          </li>
                      ))}
                  </ol>
                )}
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
                {isPending ? (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>{translate('processing')}...</span>
                  </div>
                ) : (
                  <ul className="space-y-2 text-muted-foreground">
                    {translatedUseCases.map((useCase, index) => (
                      <li key={index} className="flex items-start gap-2">
                         <ArrowRight className="h-4 w-4 text-primary mt-1.5 shrink-0" />
                        <span>{useCase}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
