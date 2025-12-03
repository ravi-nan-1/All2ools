
import type { Metadata } from 'next';
import {
  Handshake,
  List,
  UserCheck,
  ShieldCheck,
  AlertTriangle,
  FileUp,
  Calculator,
  Copyright,
  Server,
  XCircle,
  RefreshCcw,
  CheckCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms & Conditions | All2ools',
  description: 'Read the Terms & Conditions for using the All2ools website and its suite of free online tools.',
};

const SectionCard = ({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) => (
  <Card>
    <CardHeader className="flex flex-row items-start gap-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <div>
        <CardTitle>{title}</CardTitle>
      </div>
    </CardHeader>
    <CardContent>{children}</CardContent>
  </Card>
);

const BenefitItem = ({
  icon: Icon,
  children,
  isPositive = true,
}: {
  icon: React.ElementType;
  children: React.ReactNode;
  isPositive?: boolean;
}) => (
  <li className="flex items-start gap-3">
    <Icon
      className={`mt-1 h-5 w-5 flex-shrink-0 ${
        isPositive ? 'text-green-500' : 'text-red-500'
      }`}
    />
    <span>{children}</span>
  </li>
);

export default function TermsPage() {
  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-12 md:py-24">
        {/* --- Hero Section --- */}
        <section className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight md:text-6xl font-headline">
            Terms & Conditions
          </h1>
          <p className="mx-auto mt-4 text-lg text-muted-foreground md:text-xl">
            Last Updated: December 03, 2025
          </p>
        </section>

        {/* --- Intro --- */}
        <section className="mx-auto my-12 max-w-3xl text-center text-muted-foreground">
          <p>
            Welcome to All2ools (“we”, “our”, “us”). By accessing or using all2ools.com or any of its tools, services, or applications, you agree to be bound by these Terms & Conditions.
          </p>
          <p className="mt-2 font-semibold">If you do not agree with these terms, please do not use the website.</p>
        </section>

        <div className="mx-auto max-w-4xl space-y-12">

          <SectionCard icon={Handshake} title="1. Acceptance of Terms">
            <p className="text-muted-foreground mb-6">By using All2ools, you confirm that you:</p>
            <ul className="space-y-3">
                <BenefitItem icon={CheckCircle}>Are at least 13 years old</BenefitItem>
                <BenefitItem icon={CheckCircle}>Have the legal capacity to agree to these terms</BenefitItem>
                <BenefitItem icon={CheckCircle}>Agree to follow all applicable laws</BenefitItem>
                <BenefitItem icon={CheckCircle}>Agree not to misuse the tools</BenefitItem>
            </ul>
             <p className="mt-4 text-muted-foreground text-sm">These Terms apply to all visitors, users, and registered/unregistered individuals who access the website.</p>
          </SectionCard>

          <SectionCard icon={List} title="2. Description of Services">
             <p className="text-muted-foreground mb-6">All2ools provides a collection of online tools, including:</p>
             <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-muted-foreground list-disc pl-5">
                <li>AI-powered tools</li>
                <li>PDF & document converters</li>
                <li>Image processors</li>
                <li>SEO utilities</li>
                <li>Business calculators</li>
                <li>Finance calculators</li>
                <li>Developer/debugging tools</li>
                <li>Data extractors</li>
                <li>File compressors</li>
             </ul>
              <p className="mt-4 text-muted-foreground text-sm">We may add, modify, or remove tools at any time without prior notice.</p>
          </SectionCard>

          <SectionCard icon={UserCheck} title="3. Use of Tools & User Responsibilities">
            <p className="text-muted-foreground mb-6">You agree:</p>
            <ul className="space-y-3">
                <BenefitItem icon={CheckCircle}>Not to misuse any tool</BenefitItem>
                <BenefitItem icon={CheckCircle}>Not to upload harmful, illegal, or copyrighted content</BenefitItem>
                <BenefitItem icon={CheckCircle}>Not to attempt hacking, reverse-engineering, or exploiting the platform</BenefitItem>
                <BenefitItem icon={CheckCircle}>Not to bypass tool limits or security filters</BenefitItem>
                <BenefitItem icon={CheckCircle}>Not to use tools for malicious or fraudulent purposes</BenefitItem>
            </ul>
            <p className="mt-4 text-destructive-foreground bg-destructive/80 p-3 rounded-md text-sm">Failure to comply may result in immediate access termination.</p>
          </SectionCard>
          
          <SectionCard icon={ShieldCheck} title="4. Data Processing & Privacy">
            <p className="text-muted-foreground">Your use of All2ools is subject to our Privacy Policy. Please read it <Link href="/privacy" className="text-primary underline">here</Link>.</p>
             <p className="text-muted-foreground mt-4 font-semibold">Key points:</p>
            <ul className="mt-4 space-y-2 list-disc pl-5 text-muted-foreground">
                <li>Uploaded files are processed temporarily</li>
                <li>Data is deleted automatically after use</li>
                <li>We do not store files permanently</li>
                <li>AI content may be sent to third-party APIs for processing</li>
                <li>We never sell your data</li>
            </ul>
             <p className="mt-4 text-muted-foreground text-sm">By using our tools, you consent to this processing.</p>
          </SectionCard>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <SectionCard icon={AlertTriangle} title="5. AI Tools Disclaimer">
                <p className="text-muted-foreground mb-4">For AI-powered tools (e.g., humanizer, content generators):</p>
                <ul className="space-y-2 list-disc pl-5 text-muted-foreground text-sm">
                    <li>Outputs may vary</li>
                    <li>Accuracy is not guaranteed</li>
                    <li>No legal, medical, or financial advice is provided</li>
                    <li>You are responsible for verifying content before use</li>
                    <li>AI cannot be relied upon for high-risk decisions</li>
                </ul>
                <p className="mt-4 text-muted-foreground font-semibold text-sm">We are not liable for consequences resulting from AI output.</p>
              </SectionCard>

              <SectionCard icon={FileUp} title="6. File Upload Tools Disclaimer">
                 <p className="text-muted-foreground mb-4">For tools involving files (PDFs, Images, Excel):</p>
                 <ul className="space-y-2">
                    <BenefitItem icon={CheckCircle}>Files are processed temporarily and not stored permanently.</BenefitItem>
                    <BenefitItem icon={CheckCircle}>You must ensure you own the rights to use the uploaded file.</BenefitItem>
                 </ul>
                 <p className="text-muted-foreground mt-4 font-semibold">We are not responsible for:</p>
                 <ul className="space-y-2 mt-2">
                    <BenefitItem icon={XCircle} isPositive={false}>Corrupted input files</BenefitItem>
                    <BenefitItem icon={XCircle} isPositive={false}>Data loss due to user actions</BenefitItem>
                    <BenefitItem icon={XCircle} isPositive={false}>Incorrect extraction from poor-quality documents</BenefitItem>
                 </ul>
              </SectionCard>
          </div>
          
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <SectionCard icon={Calculator} title="7. Accuracy of Calculators & Results">
                 <p className="text-muted-foreground mb-4">Tools like loan optimizers, business valuators, and tax calculators offer estimates only.</p>
                  <ul className="space-y-2">
                    <BenefitItem icon={CheckCircle}>These tools are educational and for informational purposes.</BenefitItem>
                    <BenefitItem icon={CheckCircle}>They should not replace professional financial or legal advice.</BenefitItem>
                 </ul>
                  <p className="mt-4 text-muted-foreground font-semibold text-sm">We provide the tools “as-is” without guarantees.</p>
              </SectionCard>

              <SectionCard icon={Copyright} title="8. Intellectual Property">
                 <p className="text-muted-foreground mb-4">All content, design, code, and branding on All2ools belong to us. You may NOT:</p>
                  <ul className="space-y-2 list-disc pl-5 text-muted-foreground text-sm">
                    <li>Copy the website or clone tools</li>
                    <li>Reverse engineer our tools</li>
                    <li>Use our content without permission</li>
                 </ul>
                 <p className="mt-4 text-muted-foreground text-sm">However, you may use the outputs from our tools for personal or business use.</p>
              </SectionCard>
          </div>
          
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <SectionCard icon={Server} title="9. Third-Party Services">
                 <p className="text-muted-foreground">Some tools rely on third-party APIs (e.g., AI models, cloud hosting). We are not responsible for their downtime, errors, or service outages. Use of these services is subject to their own policies.</p>
              </SectionCard>

               <SectionCard icon={XCircle} title="10. Limitation of Liability">
                 <p className="text-muted-foreground">To the fullest extent permitted by law, we are not liable for any loss of data, inaccurate outputs, financial loss, or other damages. You use All2ools at your own risk.</p>
              </SectionCard>
          </div>

          <section className="rounded-xl bg-primary/10 p-8 text-center border-2 border-dashed border-primary/20">
                <RefreshCcw className="mx-auto h-10 w-10 text-primary" />
                <h2 className="mt-4 text-2xl font-bold">11. Modifications & Updates</h2>
                <p className="mx-auto mt-2 max-w-xl text-muted-foreground">
                    We may update features, tools, terms, or privacy policies at any time. We will update the “Last Updated” date when changes are made. Your continued use of the website means you accept the updated terms.
                </p>
          </section>

        </div>
      </div>
    </div>
  );
}
