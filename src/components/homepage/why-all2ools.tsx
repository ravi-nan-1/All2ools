
import {
  BrainCircuit,
  Zap,
  Lock,
  Sparkles,
  CheckCircle,
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
        <h2 className="text-3xl font-extrabold tracking-tight text-primary md:text-5xl font-headline">
          Why Use All2ools for Free Online Tools?
        </h2>
        <p className="mx-auto mt-4 text-lg text-muted-foreground">
          In a world where digital work is becoming faster, smarter, and more demanding, having the right tools at the right time makes all the difference. All2ools is built to solve this exact problem. Instead of searching the internet for dozens of separate utilities, you get everything in one unified platform — simple, fast, and always free online.
        </p>
        <p className="mt-4 text-lg text-muted-foreground">
            All2ools brings together AI-powered tools, image utilities like our image compressor online, PDF converters like our PDF to Word converter, SEO tools, finance calculators, and developer utilities, all designed to help you work smarter and finish tasks in seconds.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
         <div>
            <h3 className="text-2xl md:text-3xl font-bold font-headline mb-4">Fast, Simple, and Free — Built for Real Workflows</h3>
            <p className="text-muted-foreground mb-8">
              Most online tools force you to watch ads, require sign-ups, slow down your device, and don't respect your privacy. All2ools does the opposite, offering powerful features like a free PDF to Word converter, a high-quality image compressor, and a full suite of AI tools online for free.
            </p>
             <ul className="space-y-4">
                <FeatureItem icon={Lock}>No login required</FeatureItem>
                <FeatureItem icon={Sparkles}>AI-Powered Accuracy</FeatureItem>
                <FeatureItem icon={Zap}>Fast Loading & No Ads Overload</FeatureItem>
                <FeatureItem icon={CheckCircle}>Completely Free, No Limits</FeatureItem>
            </ul>
        </div>
        <div className="space-y-4">
             <Card className='bg-muted/50'>
                 <CardHeader>
                     <CardTitle className="text-xl">Your Workflow, Unified</CardTitle>
                 </CardHeader>
                 <CardContent>
                    <p className="text-muted-foreground">
                        All2ools replaces hundreds of separate websites by offering a single clean dashboard, unified design, and consistent performance. Instead of hopping across 10 websites, you stay in one smooth, productive environment, improving your efficiency, focus, and speed.
                    </p>
                 </CardContent>
             </Card>
             <Card className='bg-muted/50'>
                 <CardHeader>
                     <CardTitle className="text-xl">Built for the Future</CardTitle>
                 </CardHeader>
                 <CardContent>
                    <p className="text-muted-foreground">
                       We are expanding rapidly, adding new AI tools, smart calculators, and advanced utilities every month. Our vision is to make All2ools the #1 all-in-one digital utility hub.
                    </p>
                 </CardContent>
             </Card>
        </div>
      </div>
    </section>
  );
}
