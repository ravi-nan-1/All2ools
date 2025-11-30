
"use client";

import { useState } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { PlusCircle, Trash2, Calculator, AlertTriangle, Calendar as CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const transactionSchema = z.object({
  date: z.date({ required_error: "A date is required." }),
  type: z.enum(['buy', 'sell']),
  asset: z.string().min(1, "Asset is required.").toUpperCase(),
  quantity: z.number().positive("Must be positive."),
  price: z.number().positive("Must be positive."),
  id: z.string().optional(),
});

const formSchema = z.object({
  transactions: z.array(transactionSchema).min(1, "Add at least one transaction."),
});

type Transaction = z.infer<typeof transactionSchema>;
type FormValues = z.infer<typeof formSchema>;

interface Disposal {
    asset: string;
    date: Date;
    proceeds: number;
    costBasis: number;
    gainLoss: number;
}

export function CryptoTaxCalculator() {
  const [totalCapitalGains, setTotalCapitalGains] = useState<number | null>(null);
  const [disposals, setDisposals] = useState<Disposal[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      transactions: [],
    },
    mode: 'onChange',
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "transactions",
  });

  const onSubmit = (data: FormValues) => {
    // Deep copy to avoid mutating the form state
    let transactions = JSON.parse(JSON.stringify(data.transactions)).map((t: any) => ({...t, date: new Date(t.date), quantity: Number(t.quantity), price: Number(t.price)}));
    transactions.sort((a: Transaction, b: Transaction) => a.date.getTime() - b.date.getTime());

    const assets = [...new Set(transactions.map((t: Transaction) => t.asset))];
    let allDisposals: Disposal[] = [];
    let totalGains = 0;

    for (const asset of assets) {
      let buys = transactions.filter((t: Transaction) => t.asset === asset && t.type === 'buy');
      const sells = transactions.filter((t: Transaction) => t.asset === asset && t.type === 'sell');

      for (const sell of sells) {
        let sellQuantity = sell.quantity;
        const proceeds = sell.quantity * sell.price;
        let costBasisForSell = 0;

        for (let i = 0; i < buys.length && sellQuantity > 0; i++) {
          const buy = buys[i];
          if (buy.quantity > 0) {
            const quantityToUse = Math.min(sellQuantity, buy.quantity);
            
            costBasisForSell += quantityToUse * buy.price;
            sellQuantity -= quantityToUse;
            buy.quantity -= quantityToUse;
          }
        }
        
        const gainLoss = proceeds - costBasisForSell;
        totalGains += gainLoss;
        allDisposals.push({
          asset: sell.asset,
          date: sell.date,
          proceeds,
          costBasis: costBasisForSell,
          gainLoss,
        });
      }
    }
    
    setTotalCapitalGains(totalGains);
    setDisposals(allDisposals);
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  }

  return (
    <div className="space-y-8">
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Disclaimer: For Educational Use Only</AlertTitle>
        <AlertDescription>
          This is a simplified tool for educational purposes. It uses the FIFO method and does not account for complex scenarios like fees, wash sales, staking rewards, airdrops, or specific tax jurisdictions. **Do not use for official tax filing.** Always consult a qualified tax professional for your tax obligations.
        </AlertDescription>
      </Alert>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Transactions</CardTitle>
              <CardDescription>Add your cryptocurrency buy and sell transactions below. The calculation uses the First-In, First-Out (FIFO) method.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {fields.map((field, index) => (
                  <div key={field.id} className="p-4 border rounded-lg space-y-4 bg-muted/50">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-start">
                       <FormField control={form.control} name={`transactions.${index}.date`} render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date</FormLabel>
                          <Popover>
                              <PopoverTrigger asChild>
                                  <FormControl>
                                  <Button
                                      variant={"outline"}
                                      className={cn("w-full justify-start text-left font-normal bg-background", !field.value && "text-muted-foreground")}
                                  >
                                      <CalendarIcon className="mr-2 h-4 w-4" />
                                      {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                  </Button>
                                  </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                  <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                              </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )} />
                       <FormField control={form.control} name={`transactions.${index}.type`} render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-background"><SelectValue placeholder="Select type" /></SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="buy">Buy</SelectItem>
                              <SelectItem value="sell">Sell</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )} />
                       <FormField control={form.control} name={`transactions.${index}.asset`} render={({ field }) => (
                        <FormItem>
                          <FormLabel>Asset</FormLabel>
                          <FormControl><Input placeholder="e.g., BTC" {...field} className="uppercase bg-background"/></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name={`transactions.${index}.quantity`} render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quantity</FormLabel>
                          <FormControl><Input type="number" step="any" placeholder="e.g., 0.5" {...field} onChange={e => field.onChange(parseFloat(e.target.value) || 0)} className="bg-background"/></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                       <div className="flex flex-col space-y-2">
                        <FormField control={form.control} name={`transactions.${index}.price`} render={({ field }) => (
                          <FormItem>
                            <FormLabel>Price / Coin (USD)</FormLabel>
                            <FormControl><Input type="number" step="any" placeholder="e.g., 60000" {...field} onChange={e => field.onChange(parseFloat(e.target.value) || 0)} className="bg-background"/></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                      </div>
                    </div>
                     <div className="flex justify-end">
                         <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                           <Trash2 className="h-4 w-4 text-muted-foreground" />
                           <span className="sr-only">Remove transaction</span>
                         </Button>
                      </div>
                  </div>
                ))}
              </div>
              <Button type="button" variant="outline" size="sm" className="mt-4" onClick={() => append({ id: new Date().toISOString(), date: new Date(), type: 'buy', asset: 'BTC', quantity: 0, price: 0 })}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Transaction
              </Button>
            </CardContent>
          </Card>
          <Button type="submit" size="lg" className="w-full md:w-auto" disabled={fields.length === 0}>
            <Calculator className="mr-2 h-5 w-5" /> Calculate Capital Gains (FIFO)
          </Button>
        </form>
      </Form>
      
      {totalCapitalGains !== null && (
        <div className="space-y-6 mt-8">
            <Card className="border-primary/30">
                <CardHeader>
                    <CardTitle>Calculation Summary</CardTitle>
                    <CardDescription>Based on the provided transactions using the FIFO method.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-sm text-muted-foreground">Total Estimated Capital Gains</div>
                    <div className={`text-4xl font-bold ${totalCapitalGains >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(totalCapitalGains)}
                    </div>
                    <p className="text-muted-foreground mt-2">
                        {totalCapitalGains >= 0 ? "This is your estimated taxable gain." : "This is your estimated deductible loss."}
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Disposal Details</CardTitle>
                    <CardDescription>A breakdown of each sell transaction and its calculated gain or loss.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Asset</TableHead>
                                <TableHead className="text-right">Proceeds</TableHead>
                                <TableHead className="text-right">Cost Basis</TableHead>
                                <TableHead className="text-right">Gain / Loss</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {disposals.map((d, i) => (
                                <TableRow key={i}>
                                    <TableCell>{format(d.date, "PPP")}</TableCell>
                                    <TableCell className="font-mono">{d.asset}</TableCell>
                                    <TableCell className="text-right">{formatCurrency(d.proceeds)}</TableCell>
                                    <TableCell className="text-right">{formatCurrency(d.costBasis)}</TableCell>
                                    <TableCell className={`text-right font-medium ${d.gainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {formatCurrency(d.gainLoss)}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
      )}
    </div>
  );
}
