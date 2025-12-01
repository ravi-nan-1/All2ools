'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import {
  Trash2,
  PlusCircle,
  FileText,
  Settings,
  Eye,
  Send,
  Sparkles,
  Upload,
  CalendarIcon,
  Download,
  Loader2,
  Globe,
  Banknote,
  Percent,
  RefreshCw,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { handleInvoiceGeneration } from '@/app/actions';

const lineItemSchema = z.object({
  description: z.string().min(1, 'Description is required.'),
  hsn: z.string().optional(),
  quantity: z.coerce.number().min(0, 'Quantity must be positive.'),
  rate: z.coerce.number().min(0, 'Rate must be positive.'),
});

export const invoiceSchema = z.object({
  from: z.string().min(1, 'This field is required.'),
  billTo: z.string().min(1, 'This field is required.'),
  shipTo: z.string().optional(),
  invoiceNumber: z.string().min(1, 'Invoice number is required.'),
  date: z.date(),
  dueDate: z.date().optional(),
  lineItems: z.array(lineItemSchema).min(1, 'At least one item is required.'),
  notes: z.string().optional(),
  terms: z.string().optional(),
  bankDetails: z.string().optional(),
  tax: z.coerce.number().min(0).max(100).default(0),
  discount: z.coerce.number().min(0).default(0),
  shipping: z.coerce.number().min(0).default(0),
});

export type InvoiceFormValues = z.infer<typeof invoiceSchema>;

const countries = [
    { code: 'US', name: 'United States', currency: 'USD' },
    { code: 'GB', name: 'United Kingdom', currency: 'GBP' },
    { code: 'EU', name: 'European Union', currency: 'EUR' },
    { code: 'IN', name: 'India', currency: 'INR' },
    { code: 'JP', name: 'Japan', currency: 'JPY' },
    { code: 'CA', name: 'Canada', currency: 'CAD' },
    { code: 'AU', name: 'Australia', currency: 'AUD' },
];

export function AiInvoiceGenerator() {
  const [selectedCountry, setSelectedCountry] = useState('US');
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [isClient, setIsClient] = useState(false);
  const [isProcessingPdf, setIsProcessingPdf] = useState(false);
  const [isProcessingAi, setIsProcessingAi] = useState(false);
  const { toast } = useToast();
  const [previewPdfUrl, setPreviewPdfUrl] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      from: 'Your Company Name\n123 Street, City, Country',
      billTo: '',
      shipTo: '',
      invoiceNumber: '',
      lineItems: [{ description: '', hsn: '', quantity: 1, rate: 0 }],
      notes: 'Thank you for your business!',
      terms: 'Payment due within 30 days.',
      bankDetails: 'Bank: Your Bank Name\nAccount: 1234567890',
      tax: 0,
      discount: 0,
      shipping: 0,
    },
  });

  useEffect(() => {
    if (isClient) {
      form.reset({
        ...form.getValues(),
        date: new Date(),
        invoiceNumber: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isClient]);


  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'lineItems',
  });

  const watchAllFields = form.watch();

  const subtotal = watchAllFields.lineItems.reduce(
    (acc, item) => acc + (item.quantity || 0) * (item.rate || 0),
    0
  );
  const discountAmount = (subtotal * (watchAllFields.discount || 0)) / 100;
  const subtotalAfterDiscount = subtotal - discountAmount;
  const taxAmount = (subtotalAfterDiscount * (watchAllFields.tax || 0)) / 100;
  const total = subtotalAfterDiscount + taxAmount + (watchAllFields.shipping || 0);

  const handleAiPrompt = async (prompt: string) => {
    if (!prompt) {
      toast({ title: 'AI Info', description: 'Please enter a prompt, for example: "Make an invoice for John for 3 items."' });
      return;
    }
    setIsProcessingAi(true);
    try {
        const result = await handleInvoiceGeneration(prompt);
        if (result.error) {
            throw new Error(result.error);
        }
        
        const aiData = result.data as Omit<InvoiceFormValues, 'date' | 'dueDate'>;

        // Reset the form with AI data, but keep existing date objects
        form.reset({
            ...aiData,
            from: form.getValues('from'), // Keep user's from address
            invoiceNumber: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
            date: form.getValues('date'),
            dueDate: form.getValues('dueDate'),
        });

        toast({ title: 'AI Success', description: 'Invoice populated from your prompt.'});
    } catch(e: any) {
        toast({ title: 'AI Error', description: e.message || 'Failed to generate invoice from prompt.', variant: 'destructive'});
    } finally {
        setIsProcessingAi(false);
    }
  };
  
  const formatCurrencyForPdf = (amount: number) => {
    const currency = countries.find(c => c.code === selectedCountry)?.currency || 'USD';
    const formatted = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
    return `${currency} ${formatted}`;
  };
  
  const formatCurrencyForUi = (amount: number) => {
    const currency = countries.find(c => c.code === selectedCountry)?.currency || 'USD';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };
  
  const generatePdf = async (action: 'download' | 'preview') => {
    setIsProcessingPdf(true);
    const values = form.getValues();
    const doc = new jsPDF();

    try {
      // --- Template-specific styles ---
      const professionalBlue = [0, 51, 102];
      const modernHeader = [22, 160, 133];

      // --- Header ---
      if (selectedTemplate === 'professional') {
        doc.setFont('times', 'bold');
        doc.setFontSize(26);
        doc.setTextColor(professionalBlue[0], professionalBlue[1], professionalBlue[2]);
        doc.text('INVOICE', 20, 25);
        doc.setDrawColor(professionalBlue[0], professionalBlue[1], professionalBlue[2]);
        doc.line(20, 28, 190, 28);
      } else if (selectedTemplate === 'minimal') {
        doc.setFont('courier', 'bold');
        doc.setFontSize(22);
        doc.setTextColor(0, 0, 0);
        doc.text('INVOICE', 20, 30);
      } else { // Modern
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(20);
        doc.text('INVOICE', 20, 30);
      }

      // --- From/To Info ---
      doc.setFontSize(11);
      doc.setTextColor(80, 80, 80);
      doc.setFont('helvetica', 'normal');
      
      const fromX = selectedTemplate === 'professional' ? 190 : 140;
      const fromAlign = selectedTemplate === 'professional' ? 'right' : 'left';
      doc.text(values.from.split('\n'), fromX, 25, { align: fromAlign });

      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text('BILL TO', 20, 45);
      doc.setFont('helvetica', 'normal');
      doc.text(values.billTo.split('\n'), 20, 51);

      // --- Invoice Meta ---
      doc.setFont('helvetica', 'bold');
      doc.text('INVOICE #', 140, 50);
      doc.text('DATE', 140, 56);
      if (values.dueDate) doc.text('DUE DATE', 140, 62);
      
      doc.setFont('helvetica', 'normal');
      doc.text(values.invoiceNumber, 190, 50, { align: 'right' });
      doc.text(format(values.date, 'MMM dd, yyyy'), 190, 56, { align: 'right' });
      if (values.dueDate) doc.text(format(values.dueDate, 'MMM dd, yyyy'), 190, 62, { align: 'right' });

      if (selectedTemplate === 'professional') {
        doc.line(20, 70, 190, 70);
      }
      
      // --- Line Items Table ---
      const tableColumn = ["Description", "HSN/SAC", "Qty", "Rate", "Amount"];
      const tableRows: any[] = values.lineItems.map(item => [
          item.description,
          item.hsn || '-',
          item.quantity,
          formatCurrencyForPdf(item.rate),
          formatCurrencyForPdf(item.quantity * item.rate),
      ]);

      let tableTheme: 'striped' | 'grid' | 'plain' = 'striped';
      let headStyles: any = { fillColor: modernHeader };
      if (selectedTemplate === 'minimal') {
          tableTheme = 'grid';
          headStyles = { fillColor: [240, 240, 240], textColor: 0 };
      } else if (selectedTemplate === 'professional') {
          tableTheme = 'grid';
          headStyles = { fillColor: professionalBlue, textColor: 255 };
      }

      (doc as any).autoTable({
          head: [tableColumn],
          body: tableRows,
          startY: 75,
          theme: tableTheme,
          headStyles: headStyles,
      });
      let finalY = (doc as any).lastAutoTable.finalY;

      // --- Totals Section ---
      const totalX = 130;
      let totalY = finalY + 10;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      
      doc.text('Subtotal:', totalX, totalY);
      doc.text(formatCurrencyForPdf(subtotal), 190, totalY, { align: 'right' });
      totalY += 6;

      if (values.discount > 0) {
          doc.text(`Discount (${values.discount}%):`, totalX, totalY);
          doc.text(`-${formatCurrencyForPdf(discountAmount)}`, 190, totalY, { align: 'right' });
          totalY += 6;
      }
      if (values.tax > 0) {
          doc.text(`Tax (${values.tax}%):`, totalX, totalY);
          doc.text(`+${formatCurrencyForPdf(taxAmount)}`, 190, totalY, { align: 'right' });
          totalY += 6;
      }
      if (values.shipping > 0) {
          doc.text(`Shipping:`, totalX, totalY);
          doc.text(formatCurrencyForPdf(values.shipping), 190, totalY, { align: 'right' });
          totalY += 6;
      }
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.line(totalX, totalY, 190, totalY);
      totalY += 6;
      doc.text('TOTAL:', totalX, totalY);
      doc.text(formatCurrencyForPdf(total), 190, totalY, { align: 'right' });

      // --- Footer Notes ---
      const pageHeight = doc.internal.pageSize.height;
      let notesY = totalY + 20 > pageHeight - 60 ? totalY + 10 : pageHeight - 40;

      doc.setFontSize(9);
      doc.setTextColor(100);
      doc.setFont('helvetica', 'normal');

      if (values.notes) {
          doc.setFont('helvetica', 'bold');
          doc.text('Notes:', 20, notesY);
          doc.setFont('helvetica', 'normal');
          doc.text(values.notes.split('\n'), 20, notesY + 4, { maxWidth: 80 });
      }

      if (values.bankDetails) {
          doc.setFont('helvetica', 'bold');
          doc.text('Bank Details:', 110, notesY);
          doc.setFont('helvetica', 'normal');
          doc.text(values.bankDetails.split('\n'), 110, notesY + 4);
      }

      if (values.terms) {
          const termsY = pageHeight - 20;
          doc.setFontSize(8);
          doc.text(values.terms, doc.internal.pageSize.width / 2, termsY, { align: 'center', maxWidth: 180 });
      }

      if (action === 'download') {
          doc.save(`invoice-${values.invoiceNumber}.pdf`);
      } else if (action === 'preview') {
          doc.output('dataurlnewwindow');
      }

    } catch (error) {
        console.error("Failed to generate PDF", error);
        toast({
            title: 'PDF Generation Failed',
            description: 'An error occurred while creating the PDF.',
            variant: 'destructive'
        });
    } finally {
        setIsProcessingPdf(false);
    }
  };


  const handleSend = () => {
    const subject = `Invoice ${form.getValues('invoiceNumber')}`;
    const body = `Hi ${form.getValues('billTo').split('\n')[0]},\n\nPlease find your invoice attached.\n\nThank you for your business!\n\nBest,\n${form.getValues('from').split('\n')[0]}`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  if (!isClient) {
    return (
      <div className="flex items-center justify-center p-8 h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText />
                Invoice Editor
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              {/* Header */}
              <div className="flex justify-between gap-4 items-start">
                  <div>
                      <Button variant="outline" size="sm" onClick={() => toast({ title: 'Feature Coming Soon' })}>
                          <Upload className="mr-2 h-4 w-4" />
                          Upload Logo
                      </Button>
                  </div>
                   <div className="w-1/3">
                      <Input className="text-2xl font-bold text-right" defaultValue="INVOICE" />
                  </div>
              </div>

              {/* From/To */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium">From</label>
                  <Textarea {...form.register('from')} className="mt-1" rows={4} />
                </div>
                <div>
                  <label className="text-sm font-medium">Bill To</label>
                  <Textarea {...form.register('billTo')} className="mt-1" rows={4} />
                </div>
              </div>

              {/* Invoice Meta */}
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <label className="text-sm font-medium">Invoice Number</label>
                  <Input {...form.register('invoiceNumber')} className="mt-1" />
                </div>
                 <Controller
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                     <div>
                      <label className="text-sm font-medium block">Date</label>
                       <Popover>
                          <PopoverTrigger asChild>
                              <Button variant="outline" className={cn("w-full justify-start text-left font-normal mt-1", !field.value && "text-muted-foreground")}>
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                              </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent>
                       </Popover>
                     </div>
                  )}
                 />
                  <Controller
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                     <div>
                      <label className="text-sm font-medium block">Due Date</label>
                       <Popover>
                          <PopoverTrigger asChild>
                              <Button variant="outline" className={cn("w-full justify-start text-left font-normal mt-1", !field.value && "text-muted-foreground")}>
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                              </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent>
                       </Popover>
                     </div>
                  )}
                 />
              </div>

              {/* Line Items */}
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Description</TableHead>
                      <TableHead className="w-28">HSN/SAC</TableHead>
                      <TableHead className="w-24">Quantity</TableHead>
                      <TableHead className="w-32">Rate</TableHead>
                      <TableHead className="w-32 text-right">Amount</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fields.map((item, index) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Input
                            {...form.register(`lineItems.${index}.description`)}
                            placeholder="Item description"
                          />
                        </TableCell>
                        <TableCell>
                           <Input
                            {...form.register(`lineItems.${index}.hsn`)}
                            placeholder="998314"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            {...form.register(`lineItems.${index}.quantity`)}
                            placeholder="1"
                          />
                        </TableCell>
                        <TableCell>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{countries.find(c=>c.code === selectedCountry)?.currency.slice(0,1)}</span>
                            <Input
                              type="number"
                              {...form.register(`lineItems.${index}.rate`)}
                              placeholder="0.00"
                              className="pl-6"
                            />
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrencyForUi((watchAllFields.lineItems[index]?.quantity || 0) * (watchAllFields.lineItems[index]?.rate || 0))}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => remove(index)}
                          >
                            <Trash2 className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => append({ description: '', hsn: '', quantity: 1, rate: 0 })}
                >
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Item
                </Button>
              </div>
              
              {/* Totals */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start pt-6">
                  <div className="space-y-4">
                       <div>
                          <label className="text-sm font-medium">Notes</label>
                          <Textarea {...form.register('notes')} className="mt-1" placeholder="Any additional notes..." />
                      </div>
                       <div>
                          <label className="text-sm font-medium">Terms & Conditions</label>
                          <Textarea {...form.register('terms')} className="mt-1" placeholder="Payment terms and conditions..." />
                      </div>
                       <div>
                          <label className="text-sm font-medium">Bank Details</label>
                          <Textarea {...form.register('bankDetails')} className="mt-1" placeholder="Bank name, account number, etc." />
                      </div>
                  </div>
                   <div className="space-y-2 border p-4 rounded-lg">
                      <div className="flex justify-between items-center"><span>Subtotal</span><span>{formatCurrencyForUi(subtotal)}</span></div>
                      <div className="flex justify-between items-center">
                          <span className="flex items-center gap-1"><Percent className="h-4 w-4 text-muted-foreground"/> Discount</span>
                          <Input type="number" {...form.register('discount')} className="w-24 h-8" />
                      </div>
                       <div className="flex justify-between text-muted-foreground text-sm"><span></span><span>-{formatCurrencyForUi(discountAmount)}</span></div>
                       <div className="flex justify-between items-center">
                          <span className="flex items-center gap-1"><Percent className="h-4 w-4 text-muted-foreground"/> Tax</span>
                          <Input type="number" {...form.register('tax')} className="w-24 h-8" />
                      </div>
                      <div className="flex justify-between text-muted-foreground text-sm"><span></span><span>+{formatCurrencyForUi(taxAmount)}</span></div>
                      <div className="flex justify-between items-center">
                          <span className="flex items-center gap-1"><Banknote className="h-4 w-4 text-muted-foreground"/> Shipping</span>
                          <Input type="number" {...form.register('shipping')} className="w-24 h-8" />
                      </div>
                      <div className="border-t my-2"></div>
                      <div className="flex justify-between font-bold text-lg"><span>Total</span><span>{formatCurrencyForUi(total)}</span></div>
                  </div>
              </div>

            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles /> Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <p className="text-sm font-medium mb-1">AI Assistant</p>
                <p className="text-sm text-muted-foreground mb-2">
                  e.g., "Make an invoice for John for 13 items."
                </p>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const prompt = formData.get('ai-prompt') as string;
                    handleAiPrompt(prompt);
                }}>
                    <div className="flex gap-2">
                        <Input name="ai-prompt" placeholder="Enter a prompt..." disabled={isProcessingAi} />
                        <Button type="submit" disabled={isProcessingAi}>
                          {isProcessingAi ? <Loader2 className="animate-spin" /> : 'Generate'}
                        </Button>
                    </div>
                </form>
              </div>

              <div className='space-y-4'>
                 <div>
                    <label className="text-sm font-medium">Country (for Currency & Tax)</label>
                    <Select value={selectedCountry} onValueChange={(val) => setSelectedCountry(val)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select Country" />
                        </SelectTrigger>
                        <SelectContent>
                            {countries.map(c => <SelectItem key={c.code} value={c.code}> <Globe className="inline-block mr-2 h-4 w-4"/> {c.name} ({c.currency})</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                 <div>
                    <label className="text-sm font-medium">Template</label>
                    <Select value={selectedTemplate} onValueChange={(val) => setSelectedTemplate(val)}>
                        <SelectTrigger className="mt-1"><SelectValue placeholder="Select Template" /></SelectTrigger>
                        <SelectContent>
                           <SelectItem value="modern">Modern</SelectItem>
                           <SelectItem value="minimal">Minimal</SelectItem>
                           <SelectItem value="professional">Professional</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-4 border-t">
                <Button
                  variant="default"
                  className="w-full col-span-2"
                  onClick={() => generatePdf('preview')}
                  disabled={isProcessingPdf}
                >
                  {isProcessingPdf ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <RefreshCw className="mr-2 h-4 w-4"/>}
                  Apply Changes & Preview
                </Button>
                <Button variant="outline" onClick={() => generatePdf('download')} disabled={isProcessingPdf}>
                    {isProcessingPdf ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Download className="mr-2 h-4 w-4"/>}
                    Download
                </Button>
                <Button variant="outline" onClick={handleSend}><Send className="mr-2 h-4 w-4"/>Send</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
