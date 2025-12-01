
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Calculator, AlertTriangle, Loader2, LineChart, PieChart } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

const valuationSchema = z.object({
  revenue: z.coerce.number().min(10000, "Must be at least 10,000"),
  profit: z.coerce.number().min(0, "Cannot be negative"),
  growthRate: z.coerce.number().min(0).max(100),
  discountRate: z.coerce.number().min(5).max(30),
  industry: z.string().min(1, "Please select an industry"),
});
type ValuationFormData = z.infer<typeof valuationSchema>;

const industryMultipliers = {
  'saas': { revenue: 8, profit: 20 },
  'ecommerce': { revenue: 2, profit: 12 },
  'service': { revenue: 3, profit: 10 },
  'manufacturing': { revenue: 1.5, profit: 8 },
  'biotech': { revenue: 15, profit: 30 },
};
type Industry = keyof typeof industryMultipliers;

interface ValuationResult {
  multiplierValuation: { revenue: number, profit: number };
  dcfValuation: number;
}

export function BusinessValuationCalculator() {
  const [valuationResult, setValuationResult] = useState<ValuationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ValuationFormData>({
    resolver: zodResolver(valuationSchema),
    defaultValues: {
      revenue: 500000,
      profit: 100000,
      growthRate: 15,
      discountRate: 12,
      industry: 'saas'
    },
    mode: 'onChange',
  });

  const onSubmit = (data: ValuationFormData) => {
    setIsLoading(true);
    setValuationResult(null);

    setTimeout(() => {
      // 1. Multiplier Method
      const multipliers = industryMultipliers[data.industry as Industry];
      const revenueValuation = data.revenue * multipliers.revenue;
      const profitValuation = data.profit * multipliers.profit;

      // 2. Simplified DCF Method
      let futureCashFlows = [];
      let lastYearProfit = data.profit;
      for (let i = 1; i <= 5; i++) {
        lastYearProfit *= (1 + data.growthRate / 100);
        futureCashFlows.push(lastYearProfit);
      }
      const terminalValue = (lastYearProfit * (1 + 0.03)) / (data.discountRate/100 - 0.03); // Assume 3% perpetual growth
      futureCasheFlows.push(terminalValue);

      const dcfValuation = futureCashFlows.reduce((acc, cf, i) => {
        return acc + (cf / Math.pow(1 + data.discountRate / 100, i + 1));
      }, 0);

      setValuationResult({
        multiplierValuation: { revenue: revenueValuation, profit: profitValuation },
        dcfValuation: dcfValuation
      });
      setIsLoading(false);
    }, 1500);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { 
        style: 'currency', 
        currency: 'USD', 
        notation: 'compact',
        maximumFractionDigits: 2 
    }).format(amount);
  }

  return (
    <div className="space-y-8">
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Disclaimer: For Educational & Illustrative Use Only</AlertTitle>
        <AlertDescription>
          Business valuation is complex. This tool uses simplified models and should not be used for investment decisions. Always consult a qualified financial professional.
        </AlertDescription>
      </Alert>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField control={form.control} name="revenue" render={({ field }) => (
                <FormItem>
                    <FormLabel>Last 12 Months Revenue ($)</FormLabel>
                    <FormControl><Input type="number" {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
            )} />
             <FormField control={form.control} name="profit" render={({ field }) => (
                <FormItem>
                    <FormLabel>Last 12 Months Profit/EBITDA ($)</FormLabel>
                    <FormControl><Input type="number" {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
            )} />
            <FormField control={form.control} name="industry" render={({ field }) => (
              <FormItem>
                <FormLabel>Industry</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger><SelectValue placeholder="Select an industry" /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="saas">SaaS / Technology</SelectItem>
                    <SelectItem value="ecommerce">E-commerce / Retail</SelectItem>
                    <SelectItem value="service">Service-Based Business</SelectItem>
                    <SelectItem value="manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="biotech">Biotech / Pharma</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="growthRate" render={({ field }) => (
                <FormItem>
                    <FormLabel>Projected Annual Growth Rate: {field.value}%</FormLabel>
                    <FormControl><Slider min={0} max={100} step={1} onValueChange={(v) => field.onChange(v[0])} defaultValue={[field.value]} /></FormControl>
                    <FormMessage />
                </FormItem>
            )} />
            <FormField control={form.control} name="discountRate" render={({ field }) => (
                <FormItem>
                    <FormLabel>Discount Rate (WACC): {field.value}%</FormLabel>
                    <FormControl><Slider min={5} max={30} step={0.5} onValueChange={(v) => field.onChange(v[0])} defaultValue={[field.value]} /></FormControl>
                    <FormMessage />
                </FormItem>
            )} />
            <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Calculating...</> : <><Calculator className="mr-2 h-4 w-4" />Calculate Valuation</>}
            </Button>
          </form>
        </Form>
        <div className="space-y-6">
            {isLoading && (
                 <Card className="flex items-center justify-center text-center p-8 h-full">
                    <div>
                        <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary mb-4" />
                        <p className="text-muted-foreground">Running valuation models...</p>
                    </div>
                </Card>
            )}
            {valuationResult && !isLoading && (
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><PieChart className="text-primary"/>Multiplier Method</CardTitle>
                            <CardDescription>Valuation based on industry-standard revenue and profit multiples.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-4 text-center">
                            <div className="p-4 bg-muted rounded-lg">
                                <p className="text-sm text-muted-foreground">Based on Revenue</p>
                                <p className="text-2xl font-bold text-primary">{formatCurrency(valuationResult.multiplierValuation.revenue)}</p>
                            </div>
                             <div className="p-4 bg-muted rounded-lg">
                                <p className="text-sm text-muted-foreground">Based on Profit</p>
                                <p className="text-2xl font-bold text-primary">{formatCurrency(valuationResult.multiplierValuation.profit)}</p>
                            </div>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><LineChart className="text-primary"/>Discounted Cash Flow (DCF)</CardTitle>
                            <CardDescription>Valuation based on the present value of projected future profits.</CardDescription>
                        </CardHeader>
                        <CardContent className="text-center">
                             <div className="p-4 bg-muted rounded-lg">
                                <p className="text-sm text-muted-foreground">5-Year DCF Valuation</p>
                                <p className="text-3xl font-bold text-primary">{formatCurrency(valuationResult.dcfValuation)}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
            {!valuationResult && !isLoading && (
                 <Card className="flex items-center justify-center text-center p-8 h-full">
                    <div>
                        <p className="text-muted-foreground">Your valuation results will appear here.</p>
                    </div>
                </Card>
            )}
        </div>
      </div>
    </div>
  );
}
