import { AiProductBackgroundRemover } from '@/app/tools/ai-product-background-remover/ai-product-background-remover';
import { ContentGapAnalyzer } from '@/app/tools/content-gap-analyzer/content-gap-analyzer';
import { ApiLatencyChecker } from '@/app/tools/api-latency-checker/api-latency-checker';
import { PlaceholderTool } from './tools/placeholder-tool';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wrench } from 'lucide-react';
import { TinyUrlMaker } from '@/app/tools/tinyurl-maker/tinyurl-maker';
import { PdfToWordConverter } from '@/app/tools/pdf-to-word-converter/pdf-to-word-converter';

interface ToolInterfaceProps {
  slug: string;
}

export function ToolInterface({ slug }: ToolInterfaceProps) {
  const renderTool = () => {
    switch (slug) {
      case 'tinyurl-maker':
        return <TinyUrlMaker />;
      case 'ai-product-background-remover':
        return <AiProductBackgroundRemover />;
      case 'content-gap-analyzer':
        return <ContentGapAnalyzer />;
      case 'api-latency-checker':
        return <ApiLatencyChecker />;
      case 'pdf-to-word-converter':
        return <PdfToWordConverter />;
      default:
        return <PlaceholderTool />;
    }
  };

  return (
    <Card className="shadow-lg border-primary/20 border-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <Wrench />
          Tool Interface
        </CardTitle>
      </CardHeader>
      <CardContent>{renderTool()}</CardContent>
    </Card>
  );
}
