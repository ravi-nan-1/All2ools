
'use client';

import { useState, useMemo } from 'react';
import type { ToolCategory } from '@/lib/tools';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ToolCard, type ToolWithImage } from './tool-card';
import { useLanguage } from '@/hooks/use-language';
import { Search, ArrowRight, Check } from 'lucide-react';
import { WhyAll2ools } from './why-all2ools';
import { ToolCategories } from './tool-categories';
import { HomepageFaq } from './homepage-faq';
import { Personas } from './personas';
import { FeaturedTools } from './featured-tools';
import Link from 'next/link';
import { DeferredAdBanner } from '../shared/deferred-ad-banner';

const categories: ToolCategory[] = [
  'Finance',
  'Business',
  'Image',
  'SEO',
  'Developer',
  'Health',
];

interface HomePageClientProps {
  tools: ToolWithImage[];
}

export function HomePageClient({ tools }: HomePageClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<
    ToolCategory | 'All'
  >('All');
  const { translate } = useLanguage();

  const translatedAndFilteredTools = useMemo(() => {
    return tools
      .map(tool => ({
        ...tool,
        name: translate(tool.name),
        description: translate(tool.description),
      }))
      .filter((tool) => {
        const matchesCategory =
          selectedCategory === 'All' || tool.category === selectedCategory;
        const matchesSearch =
          tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tool.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
      });
  }, [tools, searchQuery, selectedCategory, translate]);

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <section className="relative bg-background py-20 px-4 text-center">
        <div className="container mx-auto max-w-6xl text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Free Online AI Tools for Every Task
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
             All2ools offers 30+ free AI tools for PDFs, PDF to Word, SEO, images, and business tasks. Fast, easy, and no signup required.
          </p>
          
          <div className="flex flex-wrap justify-center gap-6 mb-10 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-500" />
              <span>100% Free Forever</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-500" />
              <span>No Signup Required</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-500" />
              <span>Unlimited Use</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-500" />
              <span>30+ AI Tools</span>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="#tools" 
              className="px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition inline-block"
            >
              Explore All Tools →
            </a>
            <a 
              href="#popular" 
              className="px-8 py-4 bg-secondary text-secondary-foreground rounded-lg font-semibold hover:bg-secondary/90 transition inline-block"
            >
              Most Popular Tools
            </a>
          </div>
        </div>
      </section>

      <section id="tools" className="pt-12">
        <div className="max-w-xl mx-auto relative mb-8">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder={translate('search_placeholder')}
              className="w-full pl-10 h-12 text-base"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
        </div>
        <div className="flex justify-center flex-wrap gap-2 mb-12">
          <Button
            variant={selectedCategory === 'All' ? 'default' : 'outline'}
            onClick={() => setSelectedCategory('All')}
            className="rounded-full"
          >
            {translate('filter_all')}
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category)}
              className="rounded-full"
            >
              {translate(`filter_${category.toLowerCase()}`)}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {translatedAndFilteredTools.map((tool, index) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
        {translatedAndFilteredTools.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-lg">No tools found.</p>
            <p>Try adjusting your search or filters.</p>
          </div>
        )}
      </section>
      
      <div className="my-16 md:my-24">
        <DeferredAdBanner
          adSlot="YOUR_TOP_BANNER_AD_SLOT_ID"
          className="w-full min-h-[100px] flex items-center justify-center bg-muted rounded-lg"
        />
      </div>

      <WhyAll2ools />

      <ToolCategories />

      <Personas />
      
      <div className="my-16 md:my-24" id="popular">
         <DeferredAdBanner
          adSlot="YOUR_MID_BANNER_AD_SLOT_ID"
          className="w-full min-h-[100px] flex items-center justify-center bg-muted rounded-lg"
        />
      </div>

      <FeaturedTools />

      <HomepageFaq />

       <section className="text-center py-16 md:py-24">
        <h2 className="text-3xl font-bold font-headline">Ready to Boost Your Productivity?</h2>
        <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">Explore our full suite of free tools and start working smarter today.</p>
        <Button asChild size="lg" className="mt-8">
          <Link href="#tools">
            Explore All Tools
            <ArrowRight className="ml-2" />
          </Link>
        </Button>
      </section>
    </div>
  );
}
