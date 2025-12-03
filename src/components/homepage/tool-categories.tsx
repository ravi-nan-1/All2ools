
'use client';
import {
  BrainCircuit,
  Building2,
  FileText,
  Image,
  AreaChart,
  Code,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

const toolCategories = [
  {
    icon: AreaChart,
    title: 'SEO Tools',
    description: 'Improve rankings with keyword clusters, plagiarism checking, and content analysis. Generate SEO-friendly outlines and product descriptions to dominate search results.',
    links: [
        {name: 'Keyword Cluster Generator', href: '/tools/keyword-cluster-generator'},
        {name: 'Content Gap Analyzer', href: '/tools/content-gap-analyzer'},
        {name: 'AI Humanizer', href: '/tools/ai-humanizer'},
    ]
  },
  {
    icon: Building2,
    title: 'Business Tools',
    description: 'Generate invoices, extract data from documents, calculate business valuations, and manage your financial workflows with our suite of business automation tools.',
     links: [
        {name: 'AI Invoice Generator', href: '/tools/ai-invoice-generator'},
        {name: 'Business Valuation Calculator', href: '/tools/business-valuation-calculator'},
        {name: 'Excel Power Tools', href: '/tools/excel-power-tools'},
    ]
  },
   {
    icon: Image,
    title: 'Image Tools',
    description: 'Compress images for faster websites, remove backgrounds from product photos with one click, and generate professional AI headshots without a photoshoot.',
     links: [
        {name: 'Image Compressor', href: '/tools/image-compressor'},
        {name: 'AI Product Background Remover', href: '/tools/ai-product-background-remover'},
        {name: 'AI Headshot Generator', href: '/tools/ai-headshot-generator'},
    ]
  },
  {
    icon: FileText,
    title: 'PDF & Document Tools',
    description: 'Convert PDFs to editable Word documents, extract tables and text from invoices, and automate your most repetitive office tasks with our document utilities.',
     links: [
        {name: 'PDF to Word Converter', href: '/tools/pdf-to-word-converter'},
        {name: 'Invoice -> Excel Extractor', href: '/tools/invoice-excel-extractor'},
        {name: 'Free Cheat Sheet Generator', href: '/tools/free-cheat-sheet-generator'},
    ]
  },
  {
    icon: Code,
    title: 'Developer Tools',
    description: 'Test API latency from global locations, decode JWT tokens, generate complex Regex from plain text, and convert JSON to Excel for easy debugging.',
     links: [
        {name: 'API Latency Checker', href: '/tools/api-latency-checker'},
        {name: 'Webhook Tester', href: '/tools/webhook-tester'},
        {name: 'JSON Hero', href: '/tools/json-excel-converter'},
    ]
  },
   {
    icon: BrainCircuit,
    title: 'Finance Tools',
    description: 'Estimate your crypto tax liability, find forex arbitrage opportunities, and compare global loan options to make smarter financial decisions.',
     links: [
        {name: 'Crypto Tax Calculator', href: '/tools/crypto-tax-calculator'},
        {name: 'Global Loan Optimizer', href: '/tools/global-loan-optimizer'},
        {name: 'Forex Arbitrage Checker', href: '/tools/forex-arbitrage-checker'},
    ]
  },
];

export function ToolCategories() {
  return (
    <section className="py-16 md:py-24 bg-muted/50 rounded-xl">
        <div className="container mx-auto">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-extrabold tracking-tight md:text-5xl font-headline">A Complete Suite of Digital Tools</h2>
                <p className="mx-auto mt-4 max-w-3xl text-lg text-muted-foreground">
                    All2ools solves this by combining 25+ essential utilities into one clean, modern platform, covering everything from SEO and business automation to developer debugging and financial calculations.
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {toolCategories.map((category) => (
                <Card key={category.title} className="flex flex-col">
                    <CardHeader className="flex-row items-center gap-4">
                        <category.icon className="w-10 h-10 text-primary" />
                        <CardTitle className="text-xl">{category.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <p className="text-muted-foreground mb-4">{category.description}</p>
                        <ul className="space-y-2">
                            {category.links.map(link => (
                                <li key={link.href}>
                                    <Link href={link.href} className="text-primary hover:underline text-sm font-medium">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            ))}
            </div>
        </div>
    </section>
  );
}
