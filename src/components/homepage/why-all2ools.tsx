
import {
  BrainCircuit,
  Building2,
  FileText,
  Image,
  AreaChart,
  Code,
  ShieldCheck,
  Zap,
  Lock,
  Smartphone,
  Gauge,
  Sparkles,
  Users,
  CheckCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const BenefitCard = ({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) => (
  <Card className="bg-background text-left">
    <CardHeader className="flex flex-row items-center gap-4 pb-2">
      <Icon className="h-8 w-8 text-primary" />
      <CardTitle className="text-lg font-semibold">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-muted-foreground text-sm">{children}</p>
    </CardContent>
  </Card>
);

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
  const toolCategories = [
    {
      icon: BrainCircuit,
      title: 'AI Tools',
      description:
        'Humanize text, generate outlines, explain content, create descriptions, summarize long documents, and more.',
    },
    {
      icon: Building2,
      title: 'Business Tools',
      description:
        'Create professional invoices, extract data from documents, analyze spreadsheets, calculate business valuations, and estimate loans.',
    },
    {
      icon: AreaChart,
      title: 'SEO Tools',
      description:
        'Build keyword clusters, analyze content gaps, generate optimized product descriptions, and improve your website’s ranking strategy.',
    },
    {
      icon: FileText,
      title: 'PDF & Document Tools',
      description:
        'Convert PDF to Word, extract table data, analyze documents, and automate repetitive office tasks.',
    },
    {
      icon: Image,
      title: 'Image Tools',
      description:
        'Compress images, remove backgrounds, generate AI headshots, and prepare visuals for e-commerce or branding.',
    },
    {
      icon: Code,
      title: 'Developer Tools',
      description:
        'Test API latency, generate regex, decode JWT tokens, convert JSON to Excel, and debug integrations instantly.',
    },
     {
      icon: Sparkles,
      title: 'Finance Tools',
      description:
        'Run crypto tax calculations, analyze forex arbitrage, compare global loans, and estimate investment returns.',
    },
  ];

  const userGroups = [
    'Students', 'Professionals', 'Developers', 'Marketers', 'Creators & Designers', 'Business Owners'
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-20">
      <header className="text-center">
        <h2 className="text-3xl font-extrabold tracking-tight text-primary md:text-5xl font-headline">
          Why Use All2ools?
        </h2>
        <p className="mx-auto mt-4 max-w-3xl text-lg text-muted-foreground">
          In a world where digital work is becoming faster, smarter, and more demanding, having the right tools at the right time makes all the difference. All2ools is built to solve this exact problem. Instead of searching the internet for dozens of separate utilities, you get everything in one unified platform — simple, fast, and always free.
        </p>
      </header>
      
      <section>
        <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold font-headline">A Complete Suite of Digital Tools in One Place</h3>
            <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">Most people use 10–20 different tools to get things done, wasting time and breaking workflow. All2ools solves this by combining 25+ essential tools into one clean platform.</p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {toolCategories.map((cat) => (
            <BenefitCard key={cat.title} icon={cat.icon} title={cat.title}>
              {cat.description}
            </BenefitCard>
          ))}
        </div>
      </section>

      <section className="grid items-center gap-12 md:grid-cols-2">
         <div className="order-2 md:order-1">
             <h3 className="text-2xl md:text-3xl font-bold font-headline">Who All2ools Is Made For</h3>
             <p className="mt-4 text-muted-foreground">
              All2ools is designed for anyone who works with digital content, data, or online tools. No downloads, no login required, no complications. Just open a tool and get your work done.
            </p>
             <div className="mt-8 grid grid-cols-2 gap-4">
                {userGroups.map(group => (
                     <div key={group} className="flex items-center gap-3">
                        <Users className="h-5 w-5 text-primary" />
                        <span className="font-medium">{group}</span>
                    </div>
                ))}
             </div>
        </div>
         <div className="order-1 md:order-2">
            <Image
                src="https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=800&q=80"
                alt="Diverse group of professionals working"
                width={600}
                height={400}
                className="rounded-xl shadow-lg"
                data-ai-hint="diverse professionals working"
            />
        </div>
      </section>
      
       <section>
        <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold font-headline">Fast, Simple, and Free — Built for Real Workflows</h3>
            <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">Unlike most online tools, All2ools prioritizes user experience and privacy over everything else.</p>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <ul className="space-y-4">
                <FeatureItem icon={Lock}>No login required</FeatureItem>
                <FeatureItem icon={ShieldCheck}>Secure & Private</FeatureItem>
                <FeatureItem icon={Gauge}>Fast Loading Times</FeatureItem>
            </ul>
             <ul className="space-y-4">
                <FeatureItem icon={Zap}>No Ads Overload</FeatureItem>
                <FeatureItem icon={Sparkles}>AI-Powered Accuracy</FeatureItem>
                <FeatureItem icon={CheckCircle}>Always Free</FeatureItem>
            </ul>
             <ul className="space-y-4">
                 <FeatureItem icon={Smartphone}>Mobile-Friendly</FeatureItem>
                 <FeatureItem icon={CheckCircle}>Built for Real Use-Cases</FeatureItem>
                 <FeatureItem icon={CheckCircle}>Clean, Modern UI</FeatureItem>
            </ul>
        </div>
      </section>
    </div>
  );
}
