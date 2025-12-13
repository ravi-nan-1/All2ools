
import Link from 'next/link';
import Image from 'next/image';
import * as icons from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Tool } from '@/lib/tools';
import { useLanguage } from '@/hooks/use-language';
import { ArrowRight, Wrench } from 'lucide-react';

export type ToolWithImage = Tool & { image: string; imageHint: string, width: number, height: number };

interface ToolCardProps {
  tool: ToolWithImage;
  priority?: boolean;
}

export function ToolCard({ tool, priority = false }: ToolCardProps) {
  const { translate } = useLanguage();
  const Icon = icons[tool.icon as keyof typeof icons] || Wrench;

  return (
    <Card className="flex flex-col overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-xl group">
       <Link href={`/tools/${tool.slug}`} className="flex flex-col h-full">
            <div className="relative aspect-video w-full">
              <Image
                src={tool.image}
                alt={tool.name}
                fill
                className="rounded-t-lg object-cover"
                data-ai-hint={tool.imageHint}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </div>
          <CardHeader className="p-4">
            <div className="flex items-start justify-between gap-4">
                <CardTitle className="text-base font-headline leading-snug">
                    {tool.name}
                </CardTitle>
                <Icon className="h-8 w-8 text-primary/80 shrink-0" />
            </div>
            <Badge variant="outline" className="w-fit">{tool.category}</Badge>
          </CardHeader>
          <CardContent className="flex-grow p-4 pt-0">
            <CardDescription className="text-sm leading-snug">{tool.description}</CardDescription>
          </CardContent>
          <CardFooter className="p-4 pt-0 mt-auto">
             <div className="w-full text-primary font-semibold flex items-center group-hover:underline">
                {translate('use_tool')}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </CardFooter>
       </Link>
    </Card>
  );
}
