
'use client';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqItems = [
  {
    question: 'Is All2ools completely free to use?',
    answer: 'Yes, all tools currently available on All2ools are completely free to use. There are no hidden charges, subscription fees, or usage limits. Our goal is to provide powerful utilities to everyone without barriers.',
  },
  {
    question: 'Do I need to create an account or sign up?',
    answer: 'No, you do not need to create an account. All of our tools are accessible instantly without any signup required. We believe in providing a fast and frictionless experience.',
  },
  {
    question: 'Are my uploaded files and data secure?',
    answer: 'Yes, your privacy and security are top priorities. Most of our tools process data directly in your browser. For tools that require server-side processing, we do not store your files or data permanently. All uploads are deleted automatically after the tool finishes its job.',
  },
  {
    question: 'How many tools does All2ools offer?',
    answer: 'All2ools offers a growing suite of over 25 essential tools across various categories, including SEO, Business, Finance, Image, PDF, and Developer utilities. We are constantly building and adding new tools every month based on user feedback.',
  },
  {
    question: 'Can I use these tools on my mobile device?',
    answer: 'Absolutely. The All2ools platform is designed to be fully responsive and mobile-friendly. You can use all of our utilities smoothly on your phone, tablet, or desktop computer.',
  },
   {
    question: 'How is All2ools different from other online tool websites?',
    answer: 'We focus on three things: speed, simplicity, and privacy. Unlike many other sites, we avoid excessive ads, never require a login, and do not store your data. Our tools are built with a clean, modern UI and are optimized for real-world workflows.',
  },
];

export function HomepageFaq() {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold tracking-tight md:text-5xl font-headline">
                Frequently Asked Questions
            </h2>
        </div>
        <Accordion type="single" collapsible className="w-full">
          {faqItems.map((item, index) => (
            <AccordionItem value={`item-${index}`} key={index}>
              <AccordionTrigger className="text-lg text-left">{item.question}</AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
