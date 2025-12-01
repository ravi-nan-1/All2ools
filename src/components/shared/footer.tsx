
'use client';

import Link from 'next/link';
import { ExternalLink } from 'lucide-react';

const relatedTools = [
  { name: "HUMANIZER", description: "Convert AI text to sound more human.", href: "https://humanizer.all2ools.com" },
  { name: "PDF / Word / Document Tools", description: "Convert and edit PDF & Word files.", href: "https://pdf2word.all2ools.com" },
  { name: "STUDIO — File Flipper", description: "A universal file converter for any format.", href: "https://files-flipper.vercel.app" },
  { name: "Plagiarism Detector", description: "Check text for originality and AI content.", href: "https://plagiarism.all2ools.com" },
  { name: "Excel Pro", description: "Advanced tools for spreadsheet automation.", href: "https://iloveexcel.all2ools.com" },
  { name: "TinyURL – URL Shortener", description: "Create short, trackable links.", href: "https://tinyurl.all2ools.com" },
  { name: "Image Converter", description: "Convert images between JPG, PNG, WEBP, etc.", href: "https://image.all2ools.com" },
  { name: "Rent Apartment Map Tool", description: "Find rental listings on an interactive map.", href: "https://rent.all2ools.com" },
  { name: "Image Compressor", description: "Reduce image file sizes for free.", href: "https://imagecompressor.all2ools.com" },
  { name: "Cheat Sheet / Summary Generator", description: "Instantly summarize documents and text.", href: "https://summary.all2ools.com" },
  { name: "QR Generator", description: "Create custom QR codes for your links.", href: "https://qr.all2ools.com" },
  { name: "AI Study Buddy / Tutor", description: "Your personal AI-powered study assistant.", href: "https://aitutor.all2ools.com" },
];

export function Footer() {
  return (
    <footer className="w-full bg-background border-t border-border mt-auto py-12">
      <div className="container mx-auto text-center">
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-foreground mb-3 font-headline">Related Tools</h3>
          <p className="mb-8 text-muted-foreground">To improve productivity, try our other free tools:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {relatedTools.map((tool) => (
              <a 
                key={tool.name} 
                href={tool.href} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="group block p-6 rounded-lg bg-card border text-left transition-all hover:border-primary/50 hover:shadow-lg hover:-translate-y-1"
              >
                <h4 className="font-bold text-base text-foreground flex justify-between items-center">
                  {tool.name}
                  <ExternalLink className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </h4>
                <p className="text-sm text-muted-foreground mt-1">{tool.description}</p>
              </a>
            ))}
             <a 
                href="https://www.all2ools.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="group block p-6 rounded-lg bg-primary/10 border-primary/20 text-left transition-all hover:border-primary/50 hover:shadow-lg hover:-translate-y-1"
              >
                <h4 className="font-bold text-base text-primary flex justify-between items-center">
                  All Tools – Main Website
                  <ExternalLink className="h-4 w-4 text-primary/80 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </h4>
                <p className="text-sm text-primary/80 mt-1">Explore our full suite of 30+ free online tools.</p>
              </a>
          </div>
        </div>
        
        <div className="border-t pt-8 text-muted-foreground">
          <nav className="flex justify-center flex-wrap gap-x-6 gap-y-2 mb-4">
            <Link href="/" className="hover:text-primary">Home</Link>
            <Link href="/about" className="hover:text-primary">About</Link>
            <Link href="/contact" className="hover:text-primary">Contact</Link>
            <Link href="/privacy" className="hover:text-primary">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-primary">Terms of Use</Link>
          </nav>
          <p className="text-sm">&copy; 2025 PDF2Word. A part of All2ools.com</p>
        </div>
      </div>
    </footer>
  );
}
