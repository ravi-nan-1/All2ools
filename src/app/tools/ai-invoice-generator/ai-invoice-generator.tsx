'use client';

import { useState } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

const lineItemSchema = z.object({
  description: z.string().min(1, 'Description is required.'),
  quantity: z.coerce.number().min(0, 'Quantity must be positive.'),
  rate: z.coerce.number().min(0, 'Rate must be positive.'),
});

const invoiceSchema = z.object({
  from: z.string().min(1, 'This field is required.'),
  billTo: z.string().min(1, 'This field is required.'),
  shipTo: z.string().optional(),
  invoiceNumber: z.string().min(1, 'Invoice number is required.'),
  date: z.date(),
  dueDate: z.date().optional(),
  lineItems: z.array(lineItemSchema).min(1, 'At least one item is required.'),
  notes: z.string().optional(),
  terms: z.string().optional(),
  tax: z.coerce.number().min(0).max(100).default(0),
  discount: z.coerce.number().min(0).default(0),
});

type InvoiceFormValues = z.infer<typeof invoiceSchema>;

const currencies = [
  { code: 'USD', name: 'US Dollar' },
  { code: 'EUR', name: 'Euro' },
  { code: 'GBP', name: 'British Pound' },
  { code: 'INR', name: 'Indian Rupee' },
  { code: 'JPY', name: 'Japanese Yen' },
];

export function AiInvoiceGenerator() {
  const { toast } = useToast();
  const [currency, setCurrency] = useState('USD');

  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      from: 'Your Company Name\n123 Street, City, Country',
      billTo: '',
      invoiceNumber: `INV-${Math.floor(Math.random() * 10000)}`,
      date: new Date(),
      lineItems: [{ description: '', quantity: 1, rate: 0 }],
      notes: 'Thank you for your business!',
      terms: 'Payment due within 30 days.',
      tax: 0,
      discount: 0,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'lineItems',
  });

  const watchLineItems = form.watch('lineItems');
  const watchTax = form.watch('tax');
  const watchDiscount = form.watch('discount');

  const subtotal = watchLineItems.reduce(
    (acc, item) => acc + item.quantity * item.rate,
    0
  );
  const discountAmount = (subtotal * watchDiscount) / 100;
  const taxAmount = ((subtotal - discountAmount) * watchTax) / 100;
  const total = subtotal - discountAmount + taxAmount;

  const handleAiPrompt = (prompt: string) => {
    if (prompt.toLowerCase().includes('john')) {
      form.reset({
        ...form.getValues(),
        billTo: 'John Doe\n456 Oak Ave, Town, USA',
        lineItems: [
          { description: 'Web Development Services', quantity: 10, rate: 80 },
          { description: 'UI/UX Design Mockups', quantity: 5, rate: 50 },
          { description: 'Project Management', quantity: 8, rate: 60 },
        ],
        tax: 8,
      });
      toast({ title: 'AI Success', description: 'Invoice populated from your prompt.'});
    } else {
      toast({ title: 'AI Info', description: 'This is a demo. Try a prompt like: "Make an invoice for John for 3 items."' });
    }
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };


  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText />
              Invoice Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Header */}
            <div className="flex justify-between gap-4 items-start">
                <div>
                    <Button variant="outline" size="sm" disabled>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Logo
                    </Button>
                </div>
                 <div className="w-1/3">
                    <Input className="text-2xl font-bold text-right" defaultValue="INVOICE" />
                </div>
            </div>

            {/* From/To */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium">From</label>
                <Textarea {...form.register('from')} className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium">Bill To</label>
                <Textarea {...form.register('billTo')} className="mt-1" />
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
                          type="number"
                          {...form.register(`lineItems.${index}.quantity`)}
                          placeholder="1"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          {...form.register(`lineItems.${index}.rate`)}
                          placeholder="0.00"
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(watchLineItems[index].quantity * watchLineItems[index].rate)}
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
                onClick={() => append({ description: '', quantity: 1, rate: 0 })}
              >
                <PlusCircle className="mr-2 h-4 w-4" /> Add Item
              </Button>
            </div>
            
            {/* Totals */}
            <div className="grid grid-cols-2 gap-12 items-start">
                <div className="space-y-4">
                     <div>
                        <label className="text-sm font-medium">Notes</label>
                        <Textarea {...form.register('notes')} className="mt-1" placeholder="Any additional notes..." />
                    </div>
                     <div>
                        <label className="text-sm font-medium">Terms</label>
                        <Textarea {...form.register('terms')} className="mt-1" placeholder="Payment terms and conditions..." />
                    </div>
                </div>
                 <div className="space-y-2">
                    <div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
                    <div className="flex justify-between items-center">
                        <span>Discount (%)</span>
                        <Input type="number" {...form.register('discount')} className="w-24 h-8" />
                    </div>
                     <div className="flex justify-between"><span></span><span className="text-sm text-muted-foreground">-{formatCurrency(discountAmount)}</span></div>
                     <div className="flex justify-between items-center">
                        <span>Tax (%)</span>
                        <Input type="number" {...form.register('tax')} className="w-24 h-8" />
                    </div>
                    <div className="flex justify-between"><span></span><span className="text-sm text-muted-foreground">+{formatCurrency(taxAmount)}</span></div>
                    <div className="border-t my-2"></div>
                    <div className="flex justify-between font-bold text-lg"><span>Total</span><span>{formatCurrency(total)}</span></div>
                </div>
            </div>

          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-1 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles /> AI Assistant
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-2">
              Describe the invoice you want to create. For example: "Make an
              invoice for John for 3 items."
            </p>
            <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const prompt = formData.get('ai-prompt') as string;
                handleAiPrompt(prompt);
            }}>
                <div className="flex gap-2">
                    <Input name="ai-prompt" placeholder="Enter a prompt..." />
                    <Button type="submit">Generate</Button>
                </div>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings /> Controls
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             <div>
                <label className="text-sm font-medium">Currency</label>
                <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger className="mt-1"><SelectValue placeholder="Select Currency" /></SelectTrigger>
                    <SelectContent>
                        {currencies.map(c => <SelectItem key={c.code} value={c.code}>{c.name} ({c.code})</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
             <div>
                <label className="text-sm font-medium">Template</label>
                <Select defaultValue="modern">
                    <SelectTrigger className="mt-1"><SelectValue placeholder="Select Template" /></SelectTrigger>
                    <SelectContent>
                       <SelectItem value="modern">Modern</SelectItem>
                       <SelectItem value="minimal" disabled>Minimal</SelectItem>
                       <SelectItem value="professional" disabled>Professional</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-4">
                <Button variant="outline" disabled><Eye className="mr-2 h-4 w-4"/>Preview</Button>
                <Button variant="outline" disabled><Download className="mr-2 h-4 w-4"/>Download</Button>
                <Button className="col-span-2" disabled><Send className="mr-2 h-4 w-4"/>Send Invoice</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
