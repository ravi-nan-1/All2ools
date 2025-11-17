"use client";

import type { Tool } from '@/lib/tools';
import type { GenerateSEOMetadataOutput } from '@/ai/flows/generate-seo-metadata';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/hooks/use-language';
import { LanguageSwitcher } from './language-switcher';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, CheckCircle2, Sparkles, BookOpen, BrainCircuit, HelpCircle, ArrowRight, Loader2 } from 'lucide-react';
import { ToolInterface } from './tool-interface';
import { AdBanner } from '@/components/shared/ad-banner';
import { useState, useEffect, useCallback, useTransition } from 'react';
import { handlePageTranslation } from '@/app/actions';
import type { PageContent } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';


interface ToolPageClientProps {
  tool: Tool & { image: string; imageHint: string };
  aiContent: GenerateSEOMetadataOutput;
  translations: Record<string, Record<string, string>>;
}

export function ToolPageClient({ tool, aiContent, translations }: ToolPageClientProps) {
  const { language } = useLanguage();
  const { toast } = useToast();
  const { jsonLdSchema } = aiContent;

  const [isPending, startTransition] = useTransition();

  const getTranslation = useCallback((key: string) => {
    return translations[language]?.[key] || translations['en']?.[key] || key;
  }, [language, translations]);

  const [pageContent, setPageContent] = useState<PageContent>({
    longDescription: getTranslation(`${tool.slug}_long_description`),
    faq: getTranslation(`${tool.slug}_faq`),
    features: getTranslation(`${tool.slug}_features`),
    howItWorks: getTranslation(`${tool.slug}_how_it_works`),
    useCases: getTranslation(`${tool.slug}_use_cases`),
  });

  const getOriginalContent = useCallback(() => {
    const original: PageContent = {
      longDescription: translations['en'][`${tool.slug}_long_description`] || '',
      faq: translations['en'][`${tool.slug}_faq`] || '',
      features: translations['en'][`${tool.slug}_features`] || '',
      howItWorks: translations['en'][`${tool.slug}_how_it_works`] || '',
      useCases: translations['en'][`${tool.slug}_use_cases`] || '',
    };
    return original;
  }, [tool.slug, translations]);
  
  useEffect(() => {
    if (language === 'en') {
      setPageContent(getOriginalContent());
      return;
    }

    startTransition(async () => {
      const originalContent = getOriginalContent();
      const result = await handlePageTranslation(originalContent, language);
      if (result.error) {
         toast({
          title: "Translation Failed",
          description: result.error,
          variant: "destructive",
        });
        setPageContent(getOriginalContent()); // Revert to english on failure
      } else if (result.data) {
        setPageContent(result.data);
      }
    });

  }, [language, tool.slug, getOriginalContent, toast]);

  const faqItems = (pageContent.faq || '').split('\n\n').map(q => q.trim()).filter(Boolean);
  const featureItems = (pageContent.features || '').split('\n').map(f => f.trim()).filter(Boolean);
  const howItWorksItems = (pageContent.howItWorks || '').split('\n').map(s => s.trim()).filter(Boolean);
  const useCaseItems = (pageContent.useCases || '').split('\n').map(u => u.trim()).filter(Boolean);

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
              {getTranslation('back_to_tools')}
            </Link>
          </Button>
          <LanguageSwitcher />
        </div>

        <header className="relative w-full h-56 md:h-80 rounded-xl overflow-hidden mb-8 shadow-2xl shadow-primary/10">
           <div className="absolute inset-0 overflow-hidden">
            <Image
                src={tool.image}
                alt={`${tool.name} banner`}
                fill
                className="object-cover animate-ken-burns"
                priority
                data-ai-hint={tool.imageHint}
              />
           </div>
           <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col items-start justify-end p-6 md:p-8">
            <h1 className="text-3xl md:text-5xl font-bold text-white text-left font-headline tracking-tight shadow-black drop-shadow-lg">
              {getTranslation(tool.slug)}
            </h1>
          </div>
        </header>
        
        <div className="mx-auto max-w-4xl">
          <div className="space-y-12">
              <section>
                 <p className="text-lg text-muted-foreground leading-relaxed">
                   {isPending ? <Loader2 className="h-6 w-6 animate-spin" /> : pageContent.longDescription}
                 </p>
              </section>

              <section>
                <ToolInterface slug={tool.slug} />
              </section>

              <div className="my-8">
                <AdBanner
                  adSlot="YOUR_IN_ARTICLE_AD_SLOT_ID"
                  className="w-full min-h-[100px] flex items-center justify-center bg-muted rounded-lg"
                />
              </div>

              <section>
                <Tabs defaultValue="features" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="features"><Sparkles className="mr-2"/>{getTranslation('features')}</TabsTrigger>
                    <TabsTrigger value="how-it-works"><BookOpen className="mr-2"/>{getTranslation('how_it_works')}</TabsTrigger>
                    <TabsTrigger value="use-cases"><BrainCircuit className="mr-2"/>{getTranslation('use_cases')}</TabsTrigger>
                  </TabsList>
                  <TabsContent value="features" className="mt-6">
                    <Card>
                      <CardContent className="p-6">
                        {isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                          <ul className="space-y-3 text-muted-foreground">
                            {featureItems.map((feature, index) => (
                              <li key={index} className="flex items-start gap-3">
                                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                  <TabsContent value="how-it-works" className="mt-6">
                     <Card>
                      <CardContent className="p-6">
                         {isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                            <ol className="space-y-4 text-muted-foreground">
                                {howItWorksItems.map((step, index) => (
                                    <li key={index} className="flex items-start gap-4">
                                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-base shrink-0">{index + 1}</span>
                                        <span className="mt-1">{step}</span>
                                    </li>
                                ))}
                            </ol>
                         )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                  <TabsContent value="use-cases" className="mt-6">
                    <Card>
                      <CardContent className="p-6">
                        {isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                          <ul className="space-y-3 text-muted-foreground">
                            {useCaseItems.map((useCase, index) => (
                              <li key={index} className="flex items-start gap-3">
                                 <ArrowRight className="h-4 w-4 text-primary mt-1 shrink-0" />
                                <span>{useCase}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </section>

              <section>
                 <Card>
                  <CardHeader>
                     <CardTitle className="flex items-center gap-2 text-2xl">
                        <HelpCircle className="text-primary"/>
                        {getTranslation('faq')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : faqItems.map((faqItem, index) => {
                      const [question, ...answer] = faqItem.split('\n');
                      return (
                        <div key={index} className="border-l-2 border-primary pl-4">
                          <h4 className="font-semibold text-foreground text-lg">{question}</h4>
                          <p className="text-muted-foreground mt-1">{answer.join('\n')}</p>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              </section>
          </div>
        </div>
      </div>
    </>
  );
}
