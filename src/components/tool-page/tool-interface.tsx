
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
import { JsonExcelConverter } from '@/app/tools/json-excel-converter/json-excel-converter';
import { RegexGeneratorFromText } from '@/app/tools/regex-generator-from-text/regex-generator-from-text';
import { WebhookTester } from '@/app/tools/webhook-tester/webhook-tester';
import { OneClickArticleOutlineGenerator } from '@/app/tools/1-click-article-outline-generator/1-click-article-outline-generator';
import { InvoiceExcelExtractor } from '@/app/tools/invoice-excel-extractor/invoice-excel-extractor';
import { AiHumanizer } from '@/app/(iframe-tools)/ai-humanizer/ai-humanizer';

interface ToolInterfaceProps {
  slug: string;
}

export function ToolInterface({ slug }: ToolInterfaceProps) {
  const renderTool = () => {
    switch (slug) {
      case 'ai-humanizer':
        return <AiHumanizer />;
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
      case 'json-excel-converter':
        return <JsonExcelConverter />;
      case 'regex-generator-from-text':
        return <RegexGeneratorFromText />;
      case 'webhook-tester':
        return <WebhookTester />;
       case '1-click-article-outline-generator':
        return <OneClickArticleOutlineGenerator />;
      case 'invoice-excel-extractor':
        return <InvoiceExcelExtractor />;
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
