
'use client';
import {
  GraduationCap,
  Briefcase,
  Code2,
  PenTool,
  Megaphone,
  Store,
} from 'lucide-react';
import Image from 'next/image';

const personas = [
  {
    icon: GraduationCap,
    name: 'Students',
    description: 'Summarize long chapters, check for plagiarism, generate outlines, and convert PDFs to Word for assignments.',
  },
  {
    icon: Briefcase,
    name: 'Professionals',
    description: 'Create invoices, process PDFs, extract data into Excel, and generate compelling product descriptions for work.',
  },
  {
    icon: Code2,
    name: 'Developers',
    description: 'Test APIs, debug JWT tokens, generate Regex from text, and convert JSON to Excel for easier debugging.',
  },
  {
    icon: Megaphone,
    name: 'Marketers',
    description: 'Build SEO clusters, analyze competitor content, create new content ideas, and generate effective ad copy.',
  },
  {
    icon: PenTool,
    name: 'Creators & Designers',
    description: 'Compress high-res images, remove backgrounds, generate AI headshots, and prepare photos for e-commerce.',
  },
  {
    icon: Store,
    name: 'Business Owners',
    description: 'Calculate business valuations, analyze financials, estimate crypto taxes, and create branded invoices.',
  },
];

export function Personas() {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-square max-w-md mx-auto">
                 <Image
                    src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&q=80"
                    alt="A diverse group of professionals working collaboratively"
                    fill
                    className="rounded-xl object-cover shadow-lg"
                    data-ai-hint="professionals collaborating"
                />
            </div>
            <div>
                 <h2 className="text-3xl font-extrabold tracking-tight md:text-5xl font-headline mb-4">
                    Built for Everyone
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                    All2ools is designed for anyone who works with digital content, data, or online tools—essentially, everyone in the modern world.
                </p>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {personas.map(persona => (
                        <div key={persona.name} className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-primary/10">
                                <persona.icon className="w-6 h-6 text-primary"/>
                            </div>
                            <div>
                                <h4 className="font-semibold">{persona.name}</h4>
                                <p className="text-sm text-muted-foreground">{persona.description}</p>
                            </div>
                        </div>
                    ))}
                 </div>
            </div>
        </div>
      </div>
    </section>
  );
}
