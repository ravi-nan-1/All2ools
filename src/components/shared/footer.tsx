
'use client';

import Link from 'next/link';

const relatedTools = [
  { name: "HUMANIZER", href: "https://humanizer.all2ools.com" },
  { name: "PDF / Word / Document Tools", href: "https://pdf2word.all2ools.com" },
  { name: "STUDIO — File Flipper", href: "https://files-flipper.vercel.app" },
  { name: "Plagiarism Detector", href: "https://plagiarism.all2ools.com" },
  { name: "Excel Pro (Advanced Tools)", href: "https://iloveexcel.all2ools.com" },
  { name: "TinyURL – URL Shortener", href: "https://tinyurl.all2ools.com" },
  { name: "Image Converter", href: "https://image.all2ools.com" },
  { name: "Rent Apartment Map Tool", href: "https://rent.all2ools.com" },
  { name: "Image Compressor", href: "https://imagecompressor.all2ools.com" },
  { name: "Cheat Sheet / Summary Generator", href: "https://summary.all2ools.com" },
  { name: "All Tools – Main Website", href: "https://www.all2ools.com" },
  { name: "QR Generator", href: "https://qr.all2ools.com" },
  { name: "AI Study Buddy / Tutor", href: "https://aitutor.all2ools.com" },
  { name: "Image Tools", href: "https://imagetools.all2ools.com" },
];

export function Footer() {
  return (
    <footer className="w-full bg-background border-t border-border mt-auto py-8">
      <div className="container mx-auto text-center text-muted-foreground">
        <div className="mb-10">
          <h3 className="text-xl font-bold text-foreground mb-2">Related Tools</h3>
          <p className="mb-6">To improve productivity, try our other free tools:</p>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 text-sm">
            {relatedTools.map((tool) => (
              <a 
                key={tool.name} 
                href={tool.href} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-primary hover:underline"
              >
                {tool.name}
              </a>
            ))}
          </div>
        </div>
        
        <div className="border-t pt-6">
          <nav className="flex justify-center flex-wrap gap-x-4 gap-y-2 mb-4">
            <Link href="/" className="hover:text-primary">Home</Link>
            <Link href="/about" className="hover:text-primary">About</Link>
            <Link href="/contact" className="hover:text-primary">Contact</Link>
            <Link href="/privacy" className="hover:text-primary">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-primary">Terms of Use</Link>
          </nav>
          <p>&copy; 2025 PDF2Word. A part of All2ools.com</p>
        </div>
      </div>
    </footer>
  );
}
