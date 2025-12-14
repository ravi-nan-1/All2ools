import {
  BrainCircuit,
  Zap,
  Lock,
  Sparkles,
  CheckCircle,
  FileText,
  Image as ImageIcon,
  Code,
  DollarSign,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const FeatureItem = ({
  icon: Icon,
  children,
}: {
  icon: React.ElementType;
  children: React.ReactNode;
}) => (
  <li className="flex items-center gap-3">
    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
      <Icon className="h-5 w-5 text-primary" />
    </div>
    <span className="font-medium">{children}</span>
  </li>
);

export function WhyAll2ools() {
  return (
    <section className="space-y-20 py-16 md:py-24">
      <header className="text-center max-w-4xl mx-auto">
        {/* Main H1 - Primary Keyword Focus */}
        <h1 className="text-3xl font-extrabold tracking-tight text-primary md:text-5xl font-headline">
          Free Online Tools - 27+ Tools for PDF Converter, Image Compression & SEO
        </h1>
        
        <p className="mx-auto mt-4 text-lg text-muted-foreground">
          In a world where digital work is becoming faster, smarter, and more demanding, having the right <strong>free online tools</strong> at the right time makes all the difference. All2ools is built to solve this exact problem. Instead of searching the internet for dozens of separate utilities, you get everything in one unified platform — simple, fast, and completely free.
        </p>
        
        <p className="mt-4 text-lg text-muted-foreground">
          All2ools brings together <strong>AI-powered tools</strong>, <strong>PDF converter tools</strong> like <strong>PDF to Word</strong>, <strong>Word to PDF</strong>, <strong>PDF to JPG</strong>, image utilities like our <strong>image compressor online</strong>, <strong>plagiarism checker</strong>, <strong>QR code generator</strong>, <strong>URL shortener</strong>, SEO tools, finance calculators, and developer utilities like <strong>JSON formatter</strong> and <strong>JWT decoder</strong> — all designed to help you work smarter and finish tasks in seconds.
        </p>
      </header>

      {/* Feature Highlights with Keywords */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          {/* H2 - Secondary Keyword Focus */}
          <h2 className="text-2xl md:text-3xl font-bold font-headline mb-4">
            Why Choose All2ools? Fast, Simple & Completely Free Online Tools
          </h2>
          
          <p className="text-muted-foreground mb-8">
            Most online tools force you to watch ads, require sign-ups, slow down your device, and don't respect your privacy. All2ools does the opposite, offering powerful features like a <strong>free PDF to Word converter</strong>, <strong>PDF to Excel</strong>, <strong>merge PDF</strong>, <strong>split PDF</strong>, high-quality <strong>image compressor</strong>, <strong>background remover</strong>, <strong>plagiarism checker free</strong>, and a full suite of <strong>AI tools online for free</strong>.
          </p>
          
          <ul className="space-y-4">
            <FeatureItem icon={Lock}>No login or signup required</FeatureItem>
            <FeatureItem icon={Sparkles}>AI-Powered accuracy for PDF OCR, text humanization & content generation</FeatureItem>
            <FeatureItem icon={Zap}>Lightning-fast PDF conversion and image processing</FeatureItem>
            <FeatureItem icon={CheckCircle}>Completely free with unlimited usage - no file size limits</FeatureItem>
          </ul>
        </div>
        
        <div className="space-y-4">
          <Card className='bg-muted/50'>
            <CardHeader>
              {/* H3 - Tool Category Keywords */}
              <CardTitle className="text-xl">
                All Your Tools in One Place: PDF, Image, SEO & Developer Tools
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                All2ools replaces hundreds of separate websites by offering a single clean dashboard with <strong>PDF to Word converter free</strong>, <strong>JPG to PDF</strong>, <strong>compress image online</strong>, <strong>QR code generator free</strong>, <strong>invoice generator</strong>, <strong>webhook tester</strong>, and more. Instead of hopping across 10 websites, you stay in one smooth, productive environment, improving your efficiency, focus, and speed.
              </p>
            </CardContent>
          </Card>
          
          <Card className='bg-muted/50'>
            <CardHeader>
              {/* H3 - Future & AI Focus */}
              <CardTitle className="text-xl">
                AI-Powered Tools: PDF OCR, Humanizer, Product Descriptions & More
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We are expanding rapidly, adding new <strong>AI tools</strong> like <strong>OCR PDF to Word</strong>, <strong>AI humanizer</strong>, <strong>AI headshot generator</strong>, <strong>product description generator</strong>, smart calculators including <strong>crypto tax calculator</strong> and <strong>business valuation calculator</strong>, and advanced utilities every month. Our vision is to make All2ools the #1 all-in-one digital utility hub.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Additional SEO Section - Tool Categories */}
      <div className="space-y-12">
        {/* H2 - Tool Categories */}
        <h2 className="text-2xl md:text-4xl font-bold text-center font-headline">
          Explore Our Most Popular Free Tools
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* PDF Tools Section - EXPANDED */}
          <Card className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 border-red-200 dark:border-red-900">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5 text-red-600" />
                PDF Converter Tools
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                <li>• <strong>PDF to Word</strong> - Editable DOC/DOCX</li>
                <li>• <strong>Word to PDF</strong> - Convert documents</li>
                <li>• <strong>PDF to JPG</strong> - Extract images</li>
                <li>• <strong>JPG to PDF</strong> - Combine images</li>
                <li>• <strong>PDF to Excel</strong> - Extract tables</li>
                <li>• <strong>Excel to PDF</strong> - Spreadsheet converter</li>
                <li>• <strong>PDF to PowerPoint</strong> - PPT conversion</li>
                <li>• <strong>PPT to PDF</strong> - Presentation to PDF</li>
                <li>• <strong>HTML to PDF</strong> - Webpage saver</li>
                <li className="pt-2 font-semibold text-red-600">+ 15 more PDF tools</li>
              </ul>
            </CardContent>
          </Card>

          {/* PDF Editing Tools Section - NEW */}
          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200 dark:border-purple-900">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5 text-purple-600" />
                PDF Editing Tools
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                <li>• <strong>Merge PDF</strong> - Combine multiple files</li>
                <li>• <strong>Split PDF</strong> - Separate pages</li>
                <li>• <strong>Extract Pages</strong> - Get specific pages</li>
                <li>• <strong>Delete Pages</strong> - Remove unwanted pages</li>
                <li>• <strong>Reorder Pages</strong> - Rearrange PDF</li>
                <li>• <strong>Rotate Pages</strong> - Fix orientation</li>
                <li>• <strong>Add Watermark</strong> - Brand protection</li>
                <li>• <strong>Add Page Numbers</strong> - Number pages</li>
                <li>• <strong>Protect PDF</strong> - Password lock</li>
                <li>• <strong>Unlock PDF</strong> - Remove restrictions</li>
                <li>• <strong>Repair PDF</strong> - Fix corrupted files</li>
                <li>• <strong>Convert to PDF/A</strong> - Archive format</li>
                <li>• <strong>OCR PDF to Word</strong> - Scan to text</li>
                <li>• <strong>Edit PDF</strong> - Modify content</li>
              </ul>
            </CardContent>
          </Card>

          {/* Image Tools Section */}
          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border-blue-200 dark:border-blue-900">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-blue-600" />
                Image Tools
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                <li>• <strong>Image Compressor</strong> - Reduce JPG, PNG by 90%</li>
                <li>• <strong>Background Remover</strong> - AI transparency</li>
                <li>• <strong>AI Headshot Generator</strong> - Professional photos</li>
                <li>• <strong>Product Background Remover</strong> - E-commerce ready</li>
                <li className="pt-2 text-xs opacity-75">Supports JPG, PNG, WebP, GIF</li>
              </ul>
            </CardContent>
          </Card>

          {/* SEO & Content Tools */}
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-900">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BrainCircuit className="h-5 w-5 text-green-600" />
                SEO & Content Tools
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                <li>• <strong>Plagiarism Checker</strong> - Scan unlimited text</li>
                <li>• <strong>AI Humanizer</strong> - Bypass AI detection</li>
                <li>• <strong>Keyword Cluster Generator</strong> - Group keywords</li>
                <li>• <strong>Article Outline Generator</strong> - SEO structure</li>
                <li>• <strong>Content Gap Analyzer</strong> - Find opportunities</li>
                <li>• <strong>Product Description Generator</strong> - AI copywriting</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Second Row - Business & Developer Tools */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Business Tools */}
          <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20 border-amber-200 dark:border-amber-900">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-600" />
                Business Tools
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                <li>• <strong>Invoice Generator</strong> - Professional invoices</li>
                <li>• <strong>Invoice to Excel Extractor</strong> - AI data extraction</li>
                <li>• <strong>Excel Power Tools</strong> - Advanced formulas</li>
                <li>• <strong>Cheat Sheet Generator</strong> - Study guides</li>
                <li>• <strong>AI Tutor</strong> - 24/7 homework help</li>
                <li>• <strong>Business Valuation Calculator</strong> - Company worth</li>
              </ul>
            </CardContent>
          </Card>

          {/* Developer Tools */}
          <Card className="bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-950/20 dark:to-gray-950/20 border-slate-200 dark:border-slate-900">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Code className="h-5 w-5 text-slate-600" />
                Developer Tools
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                <li>• <strong>QR Code Generator</strong> - Custom logos & colors</li>
                <li>• <strong>URL Shortener</strong> - Track clicks & analytics</li>
                <li>• <strong>JSON Formatter</strong> - Validate & beautify</li>
                <li>• <strong>JWT Decoder</strong> - Debug tokens</li>
                <li>• <strong>API Latency Checker</strong> - Test endpoints</li>
                <li>• <strong>Webhook Tester</strong> - Debug callbacks</li>
                <li>• <strong>AI Regex Generator</strong> - Plain English to regex</li>
              </ul>
            </CardContent>
          </Card>

          {/* Finance Tools */}
          <Card className="bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-950/20 dark:to-violet-950/20 border-indigo-200 dark:border-indigo-900">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-indigo-600" />
                Finance Tools
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                <li>• <strong>Crypto Tax Calculator</strong> - Bitcoin, Ethereum taxes</li>
                <li>• <strong>Global Loan Optimizer</strong> - Best rates worldwide</li>
                <li>• <strong>Forex Arbitrage Checker</strong> - Triangular arbitrage</li>
                <li>• <strong>Business Valuation</strong> - Multiple methods</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Comprehensive PDF Tools Section - NEW */}
      <div className="space-y-8">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-4xl font-bold font-headline mb-4">
            Complete PDF Toolkit - 24 Free PDF Tools Online
          </h2>
          <p className="text-lg text-muted-foreground">
            From <strong>PDF to Word converter free</strong> to advanced <strong>PDF editing tools</strong>, we offer the most comprehensive <strong>PDF tool suite</strong> available online. No installation, no signup, no limits.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { name: 'PDF to Word', desc: 'Editable DOCX' },
            { name: 'Word to PDF', desc: 'DOC converter' },
            { name: 'PDF to JPG', desc: 'Extract images' },
            { name: 'JPG to PDF', desc: 'Image to PDF' },
            { name: 'PDF to Excel', desc: 'XLS converter' },
            { name: 'Excel to PDF', desc: 'Spreadsheet PDF' },
            { name: 'PDF to PPT', desc: 'PowerPoint' },
            { name: 'PPT to PDF', desc: 'Presentation' },
            { name: 'HTML to PDF', desc: 'Webpage PDF' },
            { name: 'Merge PDF', desc: 'Combine files' },
            { name: 'Split PDF', desc: 'Separate pages' },
            { name: 'Extract Pages', desc: 'Get pages' },
            { name: 'Delete Pages', desc: 'Remove pages' },
            { name: 'Reorder PDF', desc: 'Rearrange' },
            { name: 'Rotate PDF', desc: 'Fix orientation' },
            { name: 'Add Watermark', desc: 'Brand PDF' },
            { name: 'Page Numbers', desc: 'Number PDF' },
            { name: 'Protect PDF', desc: 'Password lock' },
            { name: 'Unlock PDF', desc: 'Remove lock' },
            { name: 'Repair PDF', desc: 'Fix corrupted' },
            { name: 'PDF/A Convert', desc: 'Archive format' },
            { name: 'OCR PDF', desc: 'Scan to text' },
            { name: 'Edit PDF', desc: 'Modify content' },
            { name: 'Compress PDF', desc: 'Reduce size' },
          ].map((tool, index) => (
            <Card key={index} className="bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer group">
              <CardContent className="p-4 text-center">
                <FileText className="h-8 w-8 mx-auto mb-2 text-primary group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold text-sm mb-1">{tool.name}</h3>
                <p className="text-xs text-muted-foreground">{tool.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Why Our PDF Tools Are Better - SEO Content */}
      <div className="bg-muted/30 rounded-2xl p-8 md:p-12">
        <h2 className="text-2xl md:text-3xl font-bold font-headline mb-6 text-center">
          Why All2ools PDF Converter Tools Are The Best Choice
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <div>
            <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              No File Size Limits
            </h3>
            <p className="text-muted-foreground">
              Unlike other <strong>PDF converter free</strong> tools, we don't restrict file sizes. Convert large <strong>PDF to Word</strong>, <strong>PDF to Excel</strong>, or <strong>merge PDF</strong> files without worrying about upload limits.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              100% Secure & Private
            </h3>
            <p className="text-muted-foreground">
              Your files are automatically deleted after conversion. We don't store, track, or share your documents. Perfect for sensitive business PDFs, invoices, and contracts.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Lightning Fast Processing
            </h3>
            <p className="text-muted-foreground">
              Our <strong>PDF to Word online</strong> converter processes files in seconds. <strong>Split PDF</strong>, <strong>compress PDF</strong>, or <strong>protect PDF</strong> operations complete almost instantly.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              AI-Powered OCR Technology
            </h3>
            <p className="text-muted-foreground">
              Our <strong>OCR PDF to Word</strong> tool uses advanced AI to extract text from scanned PDFs with 99%+ accuracy. Convert scanned documents, receipts, and images to editable text.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
