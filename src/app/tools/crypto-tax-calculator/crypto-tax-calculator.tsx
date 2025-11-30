
"use client";

import { useState } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { PlusCircle, Trash2, Calculator, AlertTriangle } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const transactionSchema = z.object({
  date: z.date({ required_error: "A date is required." }),
  type: z.enum(['buy', 'sell']),
  asset: z.string().min(1, "Asset is required."),
  quantity: z.number().positive("Must be positive."),
  price: z.number().positive("Must be positive."),
});

const formSchema = z.object({
  transactions: z.array(transactionSchema).min(1, "Add at least one transaction."),
});

type Transaction = z.infer<typeof transactionSchema>;
type FormValues = z.infer<typeof formSchema>;

export function CryptoTaxCalculator() {
  const [capitalGains, setCapitalGains] = useState<number | null>(null);

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
    let buys: Transaction[] = [...data.transactions.filter(t => t.type === 'buy')].sort((a, b) => a.date.getTime() - b.date.getTime());
    const sells: Transaction[] = [...data.transactions.filter(t => t.type === 'sell')].sort((a, b) => a.date.getTime() - b.date.getTime());
    
    let totalGains = 0;

    for (const sell of sells) {
      let sellQuantity = sell.quantity;
      
      while (sellQuantity > 0 && buys.length > 0) {
        const buy = buys[0];
        
        if (buy.quantity <= sellQuantity) {
          totalGains += (sell.price - buy.price) * buy.quantity;
          sellQuantity -= buy.quantity;
          buys.shift();
        } else {
          totalGains += (sell.price - buy.price) * sellQuantity;
          buy.quantity -= sellQuantity;
          sellQuantity = 0;
        }
      }
    }
    setCapitalGains(totalGains);
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  }

  return (
    <div className="space-y-8">
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Disclaimer</AlertTitle>
        <AlertDescription>
          This is a simplified tool for educational purposes only. It uses the FIFO method and does not account for fees, wash sales, or specific tax jurisdictions. Do not use for official tax filing. Consult a qualified tax professional.
        </AlertDescription>
      </Alert>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Transactions</CardTitle>
              <CardDescription>Add your cryptocurrency buy and sell transactions.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {fields.map((field, index) => (
                  <div key={field.id} className="grid grid-cols-1 md:grid-cols-5 gap-2 items-start p-2 border rounded-lg">
                    <FormField control={form.control} name={`transactions.${index}.date`} render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Date</FormLabel>
                        <Popover>
                            <PopoverTrigger asChild>
                                <FormControl>
                                <Button
                                    variant={"outline"}
                                    className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                                >
                                    {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
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
                            <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
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
                        <FormControl><Input placeholder="e.g., BTC" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name={`transactions.${index}.quantity`} render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantity</FormLabel>
                        <FormControl><Input type="number" placeholder="e.g., 0.5" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name={`transactions.${index}.price`} render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price / Coin (USD)</FormLabel>
                         <FormControl><Input type="number" placeholder="e.g., 60000" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <div className="flex items-end h-full">
                       <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                         <Trash2 className="h-4 w-4 text-muted-foreground" />
                       </Button>
                    </div>
                  </div>
                ))}
              </div>
              <Button type="button" variant="outline" size="sm" className="mt-4" onClick={() => append({ date: new Date(), type: 'buy', asset: 'BTC', quantity: 0, price: 0 })}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Transaction
              </Button>
            </CardContent>
          </Card>
          <Button type="submit" size="lg" className="w-full md:w-auto">
            <Calculator className="mr-2 h-5 w-5" /> Calculate Taxes (FIFO)
          </Button>
        </form>
      </Form>
      
      {capitalGains !== null && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Estimated Capital Gains</CardTitle>
            <CardDescription>Based on the provided transactions using the FIFO method.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className={`text-4xl font-bold ${capitalGains >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(capitalGains)}
            </div>
            <p className="text-muted-foreground mt-2">
                {capitalGains >= 0 ? "Estimated taxable gain" : "Estimated deductible loss"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
