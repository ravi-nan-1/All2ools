
import { AiProductBackgroundRemover } from '@/app/tools/ai-product-background-remover/ai-product-background-remover';
import { ContentGapAnalyzer } from '@/app/tools/content-gap-analyzer/content-gap-analyzer';
import { ApiLatencyChecker } from '@/app/tools/api-latency-checker/api-latency-checker';
import { PlaceholderTool } from './tools/placeholder-tool';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wrench } from 'lucide-react';
import { TinyUrlMaker } from '@/app/tools/tinyurl-maker/tinyurl-maker';
import { PdfToWordConverter } from '@/app/tools/pdf-to-word-converter/pdf-to-word-converter';
import { AiTutor } from '@/app/tools/ai-tutor/ai-tutor';
import { ExcelPowerTools } from '@/app/tools/excel-power-tools/excel-power-tools';
import { ImageCompressor } from '@/app/tools/image-compressor/image-compressor';
import { PlagiarismChecker } from '@/app/tools/plagiarism-checker/plagiarism-checker';
import { JwtDecoderValidator } from '@/app/tools/jwt-decoder-validator/jwt-decoder-validator';
import { GlobalLoanOptimizer } from '@/app/tools/global-loan-optimizer/global-loan-optimizer';
import { CryptoTaxCalculator } from '@/app/tools/crypto-tax-calculator/crypto-tax-calculator';
import { ForexArbitrageChecker } from '@/app/tools/forex-arbitrage-checker/forex-arbitrage-checker';
import { AiInvoiceGenerator } from '@/app/tools/ai-invoice-generator/ai-invoice-generator';
import { BusinessValuationCalculator } from '@/app/tools/business-valuation-calculator/business-valuation-calculator';
import { AiHeadshotGenerator } from '@/app/tools/ai-headshot-generator/ai-headshot-generator';
import { KeywordClusterGenerator } from '@/app/tools/keyword-cluster-generator/keyword-cluster-generator';
import { AiProductDescriptionGenerator } from '@/app/tools/ai-product-description-generator/ai-product-description-generator';
import { AiSchemaMarkupGenerator } from '@/app/tools/ai-schema-markup-generator/ai-schema-markup-generator';
import { JsonExcelConverter } from '@/app/tools/json-excel-converter/json-excel-converter';

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
      case 'ai-tutor':
        return <AiTutor />;
      case 'excel-power-tools':
        return <ExcelPowerTools />;
      case 'image-compressor':
        return <ImageCompressor />;
      case 'plagiarism-checker':
        return <PlagiarismChecker />;
      case 'jwt-decoder-validator':
        return <JwtDecoderValidator />;
      case 'global-loan-optimizer':
        return <GlobalLoanOptimizer />;
      case 'crypto-tax-calculator':
        return <CryptoTaxCalculator />;
      case 'forex-arbitrage-checker':
        return <ForexArbitrageChecker />;
      case 'ai-invoice-generator':
        return <AiInvoiceGenerator />;
      case 'business-valuation-calculator':
        return <BusinessValuationCalculator />;
      case 'ai-headshot-generator':
        return <AiHeadshotGenerator />;
      case 'keyword-cluster-generator':
        return <KeywordClusterGenerator />;
      case 'ai-product-description-generator':
        return <AiProductDescriptionGenerator />;
      case 'ai-schema-markup-generator':
        return <AiSchemaMarkupGenerator />;
      case 'json-excel-converter':
        return <JsonExcelConverter />;
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
