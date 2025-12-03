
'use client';

import { tools } from '@/lib/tools';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

const featuredSlugs = [
    'pdf-to-word-converter', 
    'image-compressor', 
    'regex-generator-from-text', 
    '1-click-article-outline-generator', 
    'json-excel-converter', 
    'api-latency-checker'
];

export function FeaturedTools() {
    const featuredTools = tools.filter(tool => featuredSlugs.includes(tool.slug));
    
    return (
        <section className="py-16 md:py-24">
            <div className="container mx-auto">
                 <div className="text-center mb-12">
                    <h2 className="text-3xl font-extrabold tracking-tight md:text-5xl font-headline">
                        Featured Tools
                    </h2>
                    <p className="mx-auto mt-4 max-w-3xl text-lg text-muted-foreground">
                        Explore some of our most popular and powerful utilities, designed to solve common problems in seconds.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {featuredTools.map(tool => (
                        <Card key={tool.slug} className="group hover:border-primary/50 transition-all">
                             <Link href={`/tools/${tool.slug}`} className="flex flex-col h-full">
                                <CardHeader>
                                    <CardTitle className="text-xl">{tool.name}</CardTitle>
                                </CardHeader>
                                <CardContent className="flex-grow">
                                    <CardDescription>{tool.description}</CardDescription>
                                </CardContent>
                                 <div className="p-6 pt-0">
                                    <div className="text-primary font-semibold flex items-center group-hover:underline">
                                        Use Tool
                                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </div>
                                </div>
                             </Link>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
