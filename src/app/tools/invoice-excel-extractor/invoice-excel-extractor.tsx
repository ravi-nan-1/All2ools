
'use client';

import { useState } from 'react';
import * as XLSX from 'xlsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Loader2,
  UploadCloud,
  FileSpreadsheet,
  Table,
  AlertCircle,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table as UiTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface ExtractedData {
  vendorName: string;
  invoiceNumber: string;
  invoiceDate: string;
  totalAmount: string;
  lineItems: { description: string; quantity: string; unitPrice: string; total: string }[];
}

export function InvoiceExcelExtractor() {
  const [invoiceFile, setInvoiceFile] = useState<File | null>(null);
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(
    null
  );
  const [isExtracting, setIsExtracting] = useState<boolean>(false);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && (file.type.startsWith('image/') || file.type === 'application/pdf')) {
      setInvoiceFile(file);
      setExtractedData(null);
    } else {
      toast({
        title: 'Invalid File Type',
        description: 'Please upload a PDF or image file.',
        variant: 'destructive',
      });
    }
  };

  const handleExtract = async () => {
    if (!invoiceFile) {
      toast({
        title: 'No File Selected',
        description: 'Please upload an invoice file first.',
        variant: 'destructive',
      });
      return;
    }
    setIsExtracting(true);
    // Simulate AI extraction process
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mocked AI response
    const mockData: ExtractedData = {
      vendorName: 'Global Tech Inc.',
      invoiceNumber: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
      invoiceDate: new Date().toLocaleDateString(),
      totalAmount: '$5,900.00',
      lineItems: [
        {
          description: 'Cloud Server Hosting (Pro Plan)',
          quantity: '1',
          unitPrice: '$500.00',
          total: '$500.00',
        },
        {
          description: 'API Integration Services',
          quantity: '50',
          unitPrice: '$100.00',
          total: '$5,000.00',
        },
        {
          description: 'Domain Name Renewal (.com)',
          quantity: '2',
          unitPrice: '$25.00',
          total: '$50.00',
        },
         {
          description: 'SSL Certificate (1 Year)',
          quantity: '2',
          unitPrice: '$175.00',
          total: '$350.00',
        },
      ],
    };

    setExtractedData(mockData);
    setIsExtracting(false);
    toast({
      title: 'Extraction Complete',
      description: 'Data has been extracted from the invoice.',
    });
  };

  const handleDownload = () => {
    if (!extractedData) return;

    const worksheet = XLSX.utils.json_to_sheet(
      extractedData.lineItems.map(item => ({
        'Vendor': extractedData.vendorName,
        'Invoice #': extractedData.invoiceNumber,
        'Date': extractedData.invoiceDate,
        'Line Item': item.description,
        'Quantity': item.quantity,
        'Unit Price': item.unitPrice,
        'Line Total': item.total,
        'Invoice Total': extractedData.totalAmount,
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'InvoiceData');
    XLSX.writeFile(workbook, 'invoice_data.xlsx');
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Upload Invoice</CardTitle>
          <CardDescription>
            Select an invoice file (PDF or image) to extract data from.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <label
            htmlFor="invoice-upload"
            className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-background transition-colors"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
              <UploadCloud className="w-10 h-10 mb-3 text-muted-foreground" />
              {invoiceFile ? (
                <p className="font-semibold text-primary">{invoiceFile.name}</p>
              ) : (
                <>
                  <p className="mb-2 text-sm text-muted-foreground">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PDF, PNG, JPG, or WEBP
                  </p>
                </>
              )}
            </div>
            <Input
              id="invoice-upload"
              type="file"
              className="hidden"
              accept="image/*,application/pdf"
              onChange={handleFileChange}
              disabled={isExtracting}
            />
          </label>
          <Button
            onClick={handleExtract}
            disabled={!invoiceFile || isExtracting}
            className="w-full h-12 text-lg"
          >
            {isExtracting ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <Table className="mr-2 h-5 w-5" />
            )}
            Extract Data
          </Button>
        </CardContent>
      </Card>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Demonstration Only</AlertTitle>
        <AlertDescription>
          The AI extraction is simulated. This tool demonstrates the UI flow using mock data.
        </AlertDescription>
      </Alert>

      {isExtracting && (
        <div className="text-center p-8">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">
            AI is reading your invoice...
          </p>
        </div>
      )}

      {extractedData && (
        <Card>
          <CardHeader>
            <CardTitle>Extracted Data</CardTitle>
            <CardDescription>
              Review the data extracted from your invoice.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-sm">
                <div className="p-3 bg-muted rounded-md">
                    <p className="font-semibold">Vendor</p>
                    <p className="text-muted-foreground">{extractedData.vendorName}</p>
                </div>
                <div className="p-3 bg-muted rounded-md">
                    <p className="font-semibold">Invoice #</p>
                    <p className="text-muted-foreground">{extractedData.invoiceNumber}</p>
                </div>
                <div className="p-3 bg-muted rounded-md">
                    <p className="font-semibold">Date</p>
                    <p className="text-muted-foreground">{extractedData.invoiceDate}</p>
                </div>
                <div className="p-3 bg-muted rounded-md border-primary/50 border">
                    <p className="font-semibold text-primary">Total Amount</p>
                    <p className="font-bold text-primary">{extractedData.totalAmount}</p>
                </div>
            </div>
            <UiTable>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="text-right">Unit Price</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {extractedData.lineItems.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.description}</TableCell>
                    <TableCell className="text-right">{item.quantity}</TableCell>
                    <TableCell className="text-right">{item.unitPrice}</TableCell>
                    <TableCell className="text-right">{item.total}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </UiTable>
            <Button onClick={handleDownload} className="mt-6 w-full">
              <FileSpreadsheet className="mr-2 h-5 w-5" />
              Download as Excel
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
