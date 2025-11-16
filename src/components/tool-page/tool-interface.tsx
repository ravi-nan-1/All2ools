import { AiProductBackgroundRemover } from './tools/ai-product-background-remover';
import { ContentGapAnalyzer } from './tools/content-gap-analyzer';
import { ApiLatencyChecker } from './tools/api-latency-checker';
import { PlaceholderTool } from './tools/placeholder-tool';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wrench } from 'lucide-react';
import { AiTaxDeductionFinder } from './tools/ai-tax-deduction-finder';

interface ToolInterfaceProps {
  slug: string;
}

export function ToolInterface({ slug }: ToolInterfaceProps) {
  const renderTool = () => {
    switch (slug) {
      case 'ai-product-background-remover':
        return <AiProductBackgroundRemover />;
      case 'content-gap-analyzer':
        return <ContentGapAnalyzer />;
      case 'api-latency-checker':
        return <ApiLatencyChecker />;
      case 'ai-tax-deduction-finder':
        return <AiTaxDeductionFinder />;
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
