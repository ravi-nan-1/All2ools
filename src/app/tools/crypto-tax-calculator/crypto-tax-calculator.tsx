"use client";

import { useState, useMemo } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { UploadCloud, Link, Keyboard, AlertTriangle, ArrowRight, ArrowLeft, Loader2, Building, Wallet, Trash2, PlusCircle, Info, Calculator, Globe } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Papa from 'papaparse';

// Schemas
const transactionSchema = z.object({
    type: z.enum(['buy', 'sell']),
    asset: z.string().min(1, "Asset is required"),
    quantity: z.coerce.number().positive("Must be positive"),
    price: z.coerce.number().positive("Must be positive"),
    date: z.string().refine((d) => !isNaN(new Date(d).getTime()), "Invalid date"),
});
const formSchema = z.object({
  transactions: z.array(transactionSchema),
});
type Transaction = z.infer<typeof transactionSchema>;
type FormValues = z.infer<typeof formSchema>;

type Step = 'method' | 'upload' | 'connect' | 'manual' | 'processing' | 'calculate';

const exchanges = ['Coinbase', 'Binance', 'Kraken', 'WazirX', 'KuCoin', 'ByBit', 'OKX'];
const wallets = ['Ethereum (ETH)', 'Bitcoin (BTC)', 'Solana (SOL)', 'BNB Chain (BSC)', 'Polygon (MATIC)'];

// Tax Calculation Logic
interface Disposal {
    asset: string;
    sellDate: Date;
    proceeds: number;
    costBasis: number;
    gain: number;
    holdingPeriodDays: number;
}
interface TaxReport {
    totalGains: number;
    taxableGains: number;
    estimatedTax: number;
    country: string;
    notes: string[];
    disposals: Disposal[];
    shortTermGains?: number;
    longTermGains?: number;
}
type Country = 'US' | 'IN' | 'GB' | 'CA' | 'AU' | 'DE' | 'AE';

const countries: { code: Country, name: string }[] = [
    { code: 'US', name: 'United States' },
    { code: 'IN', name: 'India' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'CA', name: 'Canada' },
    { code: 'AU', name: 'Australia' },
    { code: 'DE', name: 'Germany' },
    { code: 'AE', name: 'United Arab Emirates' },
]

const calculateTaxesFIFO = (transactions: Transaction[], country: Country): TaxReport => {
    let disposals: Disposal[] = [];
    const assets: { [key: string]: Transaction[] } = {};

    // Separate transactions by asset
    transactions.forEach(t => {
        if (!assets[t.asset]) assets[t.asset] = [];
        assets[t.asset].push(t);
    });

    for (const asset in assets) {
        let buys = assets[asset].filter(t => t.type === 'buy').sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        const sells = assets[asset].filter(t => t.type === 'sell').sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        sells.forEach(sell => {
            let quantityToSell = sell.quantity;
            let costOfSale = 0;
            let weightedHoldingDays = 0;

            while (quantityToSell > 0 && buys.length > 0) {
                const earliestBuy = buys[0];
                const sellableQuantity = Math.min(quantityToSell, earliestBuy.quantity);

                costOfSale += sellableQuantity * earliestBuy.price;
                const holdingPeriod = (new Date(sell.date).getTime() - new Date(earliestBuy.date).getTime()) / (1000 * 3600 * 24);
                weightedHoldingDays += holdingPeriod * sellableQuantity;

                earliestBuy.quantity -= sellableQuantity;
                quantityToSell -= sellableQuantity;

                if (earliestBuy.quantity === 0) {
                    buys.shift();
                }
            }
            const averageHoldingDays = weightedHoldingDays / sell.quantity;
            disposals.push({
                asset: asset,
                sellDate: new Date(sell.date),
                proceeds: sell.quantity * sell.price,
                costBasis: costOfSale,
                gain: (sell.quantity * sell.price) - costOfSale,
                holdingPeriodDays: Math.round(averageHoldingDays)
            });
        });
    }

    const totalGains = disposals.reduce((acc, d) => acc + d.gain, 0);
    let taxableGains = totalGains;
    let estimatedTax = 0;
    let notes: string[] = ["This is a simplified calculation for educational purposes.", "Tax laws are complex and change. Consult a qualified tax professional."];
    let shortTermGains = 0;
    let longTermGains = 0;

    switch (country) {
        case 'US':
            disposals.forEach(d => {
                if (d.holdingPeriodDays > 365) longTermGains += d.gain;
                else shortTermGains += d.gain;
            });
            taxableGains = totalGains; // In the US, all gains are taxable, but at different rates.
            notes.push("USA: Long-term gains (>1 year) are taxed at lower rates than short-term gains.");
            break;
        case 'IN':
            taxableGains = totalGains;
            estimatedTax = taxableGains > 0 ? taxableGains * 0.30 : 0;
            notes.push("India: A flat 30% tax is applied to all crypto gains.", "A 1% TDS is applicable on transfers over ₹50,000. This calculator does not compute TDS.");
            break;
        case 'CA':
            taxableGains = totalGains > 0 ? totalGains * 0.50 : 0;
            notes.push("Canada: 50% of your net capital gains are taxable at your marginal income tax rate.");
            break;
        case 'AU':
            taxableGains = 0;
            disposals.forEach(d => {
                if (d.holdingPeriodDays > 365 && d.gain > 0) {
                    taxableGains += d.gain * 0.5; // 50% discount
                } else {
                    taxableGains += d.gain;
                }
            });
            notes.push("Australia: A 50% CGT discount applies to assets held for more than 12 months.");
            break;
        case 'DE':
            taxableGains = 0;
            disposals.forEach(d => {
                if (d.holdingPeriodDays <= 365) {
                    taxableGains += d.gain;
                }
            });
             notes.push("Germany: Gains are tax-free if the asset is held for more than one year.");
             break;
        case 'GB':
             taxableGains = totalGains;
             notes.push("UK: Uses a 'Share Pooling' (average cost) method, not FIFO. This FIFO calculation is an estimate only and not compliant with HMRC rules.");
             break;
        case 'AE':
             taxableGains = 0;
             estimatedTax = 0;
             notes.push("UAE: There is currently no federal capital gains tax on crypto for individuals.");
             break;
    }

    return { totalGains, taxableGains, estimatedTax, country, notes, disposals, shortTermGains, longTermGains };
}

// Main Component
export function CryptoTaxCalculator() {
  const [step, setStep] = useState<Step>('manual');
  const [importMethod, setImportMethod] = useState<string | null>('manual');
  const [fileName, setFileName] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [taxReport, setTaxReport] = useState<TaxReport | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      transactions: [],
    },
  });

  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: "transactions",
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setIsProcessing(true);
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
            const parsedTransactions = results.data.map((row: any) => {
                // This is a very basic mapper. A real app would have complex mappers per exchange.
                return {
                    type: row.Type?.toLowerCase() === 'sell' ? 'sell' : 'buy',
                    asset: row.Asset || '',
                    quantity: parseFloat(row.Quantity) || 0,
                    price: parseFloat(row.Price) || 0,
                    date: row.Date ? new Date(row.Date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                };
            }).filter(t => t.asset && t.quantity > 0 && t.price > 0);
            
            replace(parsedTransactions as Transaction[]);
            setIsProcessing(false);
            setStep('manual');
        },
        error: (error: any) => {
          console.error("CSV Parsing Error:", error);
          setIsProcessing(false);
        }
      });
    }
  };

  const handleCalculateTaxes = (country: Country) => {
    const transactions = form.getValues('transactions');
    if (transactions.length === 0) return;
    
    setIsProcessing(true);
    setTimeout(() => { // Simulate processing time
        const report = calculateTaxesFIFO(transactions, country);
        setTaxReport(report);
        setIsProcessing(false);
    }, 1000);
  }

  const formatCurrency = (amount: number, aCountry: Country) => {
        const locale = {
            'US': 'en-US', 'IN': 'en-IN', 'GB': 'en-GB', 'CA': 'en-CA', 'AU': 'en-AU', 'DE': 'de-DE', 'AE': 'en-AE'
        }[aCountry];
         const currency = {
            'US': 'USD', 'IN': 'INR', 'GB': 'GBP', 'CA': 'CAD', 'AU': 'AUD', 'DE': 'EUR', 'AE': 'AED'
        }[aCountry];
        return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount);
  }
  
  const renderStepContent = () => {
    if (isProcessing) {
        return (
            <div className="flex flex-col items-center justify-center text-center p-8 h-64">
                <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
                <h3 className="text-xl font-semibold">Processing...</h3>
                <p className="text-muted-foreground max-w-sm">
                    Analyzing transactions and calculating gains. This may take a moment.
                </p>
            </div>
        );
    }
    if (taxReport) {
        return (
           <div className="space-y-6">
                <CardHeader className="p-0 text-center">
                    <CardTitle>Tax Report Summary ({taxReport.country})</CardTitle>
                    <CardDescription>Based on your transactions using the FIFO method.</CardDescription>
                </CardHeader>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <Card>
                        <CardHeader><CardTitle>{formatCurrency(taxReport.totalGains, taxReport.country as Country)}</CardTitle></CardHeader>
                        <CardContent><p className="text-sm text-muted-foreground">Total Capital Gains</p></CardContent>
                    </Card>
                    <Card>
                        <CardHeader><CardTitle>{formatCurrency(taxReport.taxableGains, taxReport.country as Country)}</CardTitle></CardHeader>
                        <CardContent><p className="text-sm text-muted-foreground">Taxable Gains</p></CardContent>
                    </Card>
                     <Card>
                        <CardHeader><CardTitle>{formatCurrency(taxReport.estimatedTax, taxReport.country as Country)}</CardTitle></CardHeader>
                        <CardContent><p className="text-sm text-muted-foreground">Estimated Tax</p></CardContent>
                    </Card>
                </div>
                 {taxReport.country === 'US' && (
                     <div className="grid grid-cols-2 gap-4 text-center">
                        <Card><CardHeader><CardTitle>{formatCurrency(taxReport.shortTermGains || 0, 'US')}</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">Short-Term Gains</p></CardContent></Card>
                        <Card><CardHeader><CardTitle>{formatCurrency(taxReport.longTermGains || 0, 'US')}</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">Long-Term Gains</p></CardContent></Card>
                    </div>
                )}
                 <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>Calculation Notes</AlertTitle>
                    <AlertDescription>
                        <ul className="list-disc pl-4">
                            {taxReport.notes.map((note, i) => <li key={i}>{note}</li>)}
                        </ul>
                    </AlertDescription>
                </Alert>
                <h3 className="text-lg font-semibold pt-4">Disposals Breakdown</h3>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Asset</TableHead>
                                <TableHead>Sell Date</TableHead>
                                <TableHead className="text-right">Proceeds</TableHead>
                                <TableHead className="text-right">Cost Basis</TableHead>
                                <TableHead className="text-right">Gain/Loss</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {taxReport.disposals.map((d, i) => (
                                <TableRow key={i}>
                                    <TableCell>{d.asset}</TableCell>
                                    <TableCell>{d.sellDate.toLocaleDateString()}</TableCell>
                                    <TableCell className="text-right">{formatCurrency(d.proceeds, taxReport.country as Country)}</TableCell>
                                    <TableCell className="text-right">{formatCurrency(d.costBasis, taxReport.country as Country)}</TableCell>
                                    <TableCell className={`text-right font-medium ${d.gain >= 0 ? 'text-green-600' : 'text-red-600'}`}>{formatCurrency(d.gain, taxReport.country as Country)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                <Button onClick={() => setTaxReport(null)}><ArrowLeft className="mr-2 h-4 w-4" />Back to Transactions</Button>
           </div>
        )
    }

    switch (step) {
      case 'method':
        return (
          <div className="space-y-6">
             <CardHeader className="p-0">
                <CardTitle>Import Your Transactions</CardTitle>
                <CardDescription>
                  Start by adding your crypto transactions. Choose one of the methods below. You can add more later.
                </CardDescription>
            </CardHeader>
            <RadioGroup onValueChange={(val) => setImportMethod(val)} value={importMethod || ''}>
              <Label htmlFor="upload-option" className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-muted/50 has-[:checked]:bg-muted has-[:checked]:border-primary">
                <RadioGroupItem value="upload" id="upload-option" className="mr-4"/>
                <UploadCloud className="mr-4 h-6 w-6 text-primary" />
                <div>
                  <h3 className="font-semibold">Upload a file</h3>
                  <p className="text-sm text-muted-foreground">Import a CSV file from any exchange like Coinbase, Binance, etc.</p>
                </div>
              </Label>
              <Label htmlFor="connect-option" className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-muted/50 has-[:checked]:bg-muted has-[:checked]:border-primary">
                <RadioGroupItem value="connect" id="connect-option" className="mr-4"/>
                <Link className="mr-4 h-6 w-6 text-primary" />
                <div>
                  <h3 className="font-semibold">Connect Exchange / Wallet</h3>
                  <p className="text-sm text-muted-foreground">Sync your trades automatically via API or by connecting your wallet.</p>
                </div>
              </Label>
              <Label htmlFor="manual-option" className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-muted/50 has-[:checked]:bg-muted has-[:checked]:border-primary">
                <RadioGroupItem value="manual" id="manual-option" className="mr-4"/>
                <Keyboard className="mr-4 h-6 w-6 text-primary" />
                <div>
                  <h3 className="font-semibold">Enter manually</h3>
                  <p className="text-sm text-muted-foreground">Add individual transactions one by one.</p>
                </div>
              </Label>
            </RadioGroup>
            <Button className="w-full" disabled={!importMethod} onClick={() => setStep(importMethod as Step)}>
              Continue <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        );

      case 'upload':
        return (
          <div>
            <CardHeader className="p-0 mb-4">
                <CardTitle>Upload CSV/Excel File</CardTitle>
                <CardDescription>
                  Export the transaction history file from your exchange and upload it here.
                </CardDescription>
            </CardHeader>
            <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-background transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                <UploadCloud className="w-10 h-10 mb-3 text-muted-foreground" />
                {fileName ? (
                  <p className="font-semibold text-primary break-all px-2">{fileName}</p>
                ) : (
                  <>
                    <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                    <p className="text-xs text-muted-foreground">CSV, XLS, XLSX (MAX. 100MB)</p>
                  </>
                )}
              </div>
              <Input id="file-upload" type="file" className="hidden" accept=".csv, .xls, .xlsx" onChange={handleFileChange} />
            </label>
             <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={() => setStep('method')}><ArrowLeft className="mr-2 h-4 w-4" /> Back</Button>
            </div>
          </div>
        );

    case 'connect':
        return (
            <div>
                 <CardHeader className="p-0 mb-4">
                    <CardTitle>Connect an Exchange or Wallet</CardTitle>
                    <CardDescription>
                    Select a service to sync your transactions automatically. This provides read-only access.
                    </CardDescription>
                </CardHeader>

                <h3 className="font-semibold mb-2 mt-4">Exchanges</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {exchanges.map(ex => (
                        <Button key={ex} variant="outline" className="justify-start gap-2" disabled><Building className="h-4 w-4 text-muted-foreground"/> {ex}</Button>
                    ))}
                </div>
                <h3 className="font-semibold mb-2 mt-6">Wallets</h3>
                 <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {wallets.map(w => (
                         <Button key={w} variant="outline" className="justify-start gap-2" disabled><Wallet className="h-4 w-4 text-muted-foreground"/> {w}</Button>
                    ))}
                </div>
                 <div className="flex justify-between mt-6">
                    <Button variant="outline" onClick={() => setStep('method')}><ArrowLeft className="mr-2 h-4 w-4" /> Back</Button>
                    <Button disabled>Connect <ArrowRight className="ml-2 h-4 w-4" /></Button>
                </div>
            </div>
        );

    case 'manual':
        return (
            <div className="space-y-6">
                <CardHeader className="p-0">
                    <CardTitle>Manage Transactions</CardTitle>
                    <CardDescription>Add, edit, or delete your crypto transactions below. You can switch to file upload anytime.</CardDescription>
                </CardHeader>
                <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Type</TableHead><TableHead>Asset</TableHead><TableHead>Quantity</TableHead><TableHead>Price</TableHead><TableHead>Date</TableHead><TableHead></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {fields.map((field, index) => (
                            <TableRow key={field.id}>
                                <TableCell><FormField control={form.control} name={`transactions.${index}.type`} render={({ field }) => (<Select onValueChange={field.onChange} defaultValue={field.value}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="buy">Buy</SelectItem><SelectItem value="sell">Sell</SelectItem></SelectContent></Select>)} /></TableCell>
                                <TableCell><FormField control={form.control} name={`transactions.${index}.asset`} render={({ field }) => (<Input {...field} placeholder="BTC"/>)} /></TableCell>
                                <TableCell><FormField control={form.control} name={`transactions.${index}.quantity`} render={({ field }) => (<Input type="number" {...field} />)} /></TableCell>
                                <TableCell><FormField control={form.control} name={`transactions.${index}.price`} render={({ field }) => (<Input type="number" {...field} />)} /></TableCell>
                                <TableCell><FormField control={form.control} name={`transactions.${index}.date`} render={({ field }) => (<Input type="date" {...field} />)} /></TableCell>
                                <TableCell><Button variant="ghost" size="icon" onClick={() => remove(index)}><Trash2 className="h-4 w-4 text-muted-foreground" /></Button></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                </div>
                <Button type="button" variant="outline" onClick={() => append({ type: 'buy', asset: '', quantity: 0, price: 0, date: new Date().toISOString().split('T')[0] })}><PlusCircle className="mr-2 h-4 w-4" />Add Transaction</Button>
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t">
                    <Button variant="outline" onClick={() => setStep('method')}><ArrowLeft className="mr-2 h-4 w-4" /> Change Import Method</Button>
                    <Button onClick={() => setStep('calculate')} disabled={fields.length === 0}><Calculator className="mr-2 h-4 w-4"/>Calculate Taxes</Button>
                </div>
            </div>
        )
      case 'calculate':
        return (
            <div className="space-y-6">
                <CardHeader className="p-0">
                    <CardTitle>Select Your Tax Country</CardTitle>
                    <CardDescription>Choose your country of residence for tax purposes to apply the correct rules.</CardDescription>
                </CardHeader>
                <Select onValueChange={(val) => handleCalculateTaxes(val as Country)}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a country..." />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            {countries.map(c => <SelectItem key={c.code} value={c.code}><Globe className="inline-block mr-2 h-4 w-4"/>{c.name}</SelectItem>)}
                        </SelectGroup>
                    </SelectContent>
                </Select>
                 <div className="flex justify-start mt-6">
                    <Button variant="outline" onClick={() => setStep('manual')}><ArrowLeft className="mr-2 h-4 w-4" /> Back to Transactions</Button>
                </div>
            </div>
        )

      default:
        return <p>This step is under construction.</p>;
    }
  };

  return (
    <div className="space-y-8">
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Disclaimer: For Educational & Illustrative Use Only</AlertTitle>
        <AlertDescription>
          This is a simplified tool for educational purposes. It does not perform real tax calculations. **Do not use for official tax filing.** Always consult a qualified tax professional for your tax obligations.
        </AlertDescription>
      </Alert>
      
      <Form {...form}>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
          <Card className="w-full max-w-4xl mx-auto">
            <CardContent className="p-6 md:p-8">
              {renderStepContent()}
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
}
