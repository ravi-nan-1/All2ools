
'use client';

import { useState, useMemo } from 'react';
import type { ToolCategory } from '@/lib/tools';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ToolCard, type ToolWithImage } from './tool-card';
import { useLanguage } from '@/hooks/use-language';
import { Search } from 'lucide-react';
import { AdBanner } from '@/components/shared/ad-banner';
import { WhyAll2ools } from './why-all2ools';

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
      <section className="text-center py-12 md:py-20">
        <h1 className="text-4xl md:text-6xl font-bold font-headline tracking-tight">
          {translate('hero_title')}
        </h1>
        <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          {translate('hero_subtitle')}
        </p>
        <div className="mt-8 max-w-xl mx-auto relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder={translate('search_placeholder')}
            className="w-full pl-10 h-12 text-base"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </section>

      <section className="mb-12">
        <AdBanner
          adSlot="YOUR_TOP_BANNER_AD_SLOT_ID"
          className="w-full min-h-[100px] flex items-center justify-center bg-muted rounded-lg mb-8"
        />
        <div className="flex justify-center flex-wrap gap-2">
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
      </section>

      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {translatedAndFilteredTools.map((tool, index) => (
            <ToolCard key={tool.slug} tool={tool} priority={index < 4} />
          ))}
        </div>
        {translatedAndFilteredTools.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-lg">No tools found.</p>
            <p>Try adjusting your search or filters.</p>
          </div>
        )}
      </section>

      <section className="py-16 md:py-24">
        <WhyAll2ools />
      </section>
    </div>
  );
}
