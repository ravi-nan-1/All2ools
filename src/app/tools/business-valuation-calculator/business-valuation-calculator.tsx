
"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Calculator, AlertTriangle, Loader2, LineChart, PieChart, Landmark, DollarSign, Scale, Sparkles, Globe } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { handleFinancialsGeneration } from '@/app/actions';

const valuationSchema = z.object({
  revenue: z.coerce.number().min(10000, "Must be at least 10,000"),
  opex: z.coerce.number().min(0, "Cannot be negative"),
  depreciation: z.coerce.number().min(0, "Cannot be negative"),
  capex: z.coerce.number().min(0, "Cannot be negative"),
  workingCapitalChange: z.coerce.number(),
  taxRate: z.coerce.number().min(0).max(100),
  growthRate: z.coerce.number().min(-50).max(100),
  discountRate: z.coerce.number().min(5).max(30),
  industry: z.string().min(1, "Please select an industry"),
  // SDE Fields
  ownerSalary: z.coerce.number().min(0).optional(),
  addBacks: z.coerce.number().min(0).optional(),
  // Asset-Based Fields
  totalAssets: z.coerce.number().min(0).optional(),
  totalLiabilities: z.coerce.number().min(0).optional(),
});
type ValuationFormData = z.infer<typeof valuationSchema>;

const industryMultipliers = {
  'saas': { revenue: 8, profit: 20, sde: 5 },
  'ecommerce': { revenue: 2, profit: 12, sde: 3.5 },
  'service': { revenue: 3, profit: 10, sde: 3 },
  'manufacturing': { revenue: 1.5, profit: 8, sde: 4 },
  'biotech': { revenue: 15, profit: 30, sde: 6 },
};
type Industry = keyof typeof industryMultipliers;

interface ValuationResult {
  earningsValuation: { revenue: number, profit: number, sde: number };
  dcfValuation: number;
  assetValuation: { nav: number };
}

type Country = 'US' | 'IN';
const countries: { code: Country, name: string, currency: string, locale: string }[] = [
    { code: 'US', name: 'United States', currency: 'USD', locale: 'en-US' },
    { code: 'IN', name: 'India', currency: 'INR', locale: 'en-IN' },
]

export function BusinessValuationCalculator() {
  const [valuationResult, setValuationResult] = useState<ValuationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessingAi, setIsProcessingAi] = useState(false);
  const [country, setCountry] = useState<Country>('US');
  const { toast } = useToast();

  useEffect(() => {
    try {
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        if (timeZone.startsWith('Asia/')) {
            setCountry('IN');
        } else {
            setCountry('US');
        }
    } catch (error) {
        console.error("Could not detect timezone, defaulting to US.");
        setCountry('US');
    }
  }, []);
  
  const isIndia = country === 'IN';

  const form = useForm<ValuationFormData>({
    resolver: zodResolver(valuationSchema),
    defaultValues: {
      revenue: isIndia ? 5000000 : 500000,
      opex: isIndia ? 3000000 : 300000,
      depreciation: isIndia ? 250000 : 25000,
      capex: isIndia ? 400000 : 40000,
      workingCapitalChange: isIndia ? 100000 : 10000,
      taxRate: 21,
      growthRate: 15,
      discountRate: 12,
      industry: 'saas',
      ownerSalary: isIndia ? 1200000 : 80000,
      addBacks: isIndia ? 100000 : 10000,
      totalAssets: isIndia ? 4000000 : 400000,
      totalLiabilities: isIndia ? 1500000 : 150000,
    },
    mode: 'onChange',
  });
  
  const { reset } = form;
  useEffect(() => {
      reset({
        revenue: isIndia ? 5000000 : 500000,
        opex: isIndia ? 3000000 : 300000,
        depreciation: isIndia ? 250000 : 25000,
        capex: isIndia ? 400000 : 40000,
        workingCapitalChange: isIndia ? 100000 : 10000,
        taxRate: 21,
        growthRate: 15,
        discountRate: 12,
        industry: 'saas',
        ownerSalary: isIndia ? 1200000 : 80000,
        addBacks: isIndia ? 100000 : 10000,
        totalAssets: isIndia ? 4000000 : 400000,
        totalLiabilities: isIndia ? 1500000 : 150000,
      });
  }, [country, isIndia, reset]);


  const onSubmit = (data: ValuationFormData) => {
    setIsLoading(true);
    setValuationResult(null);

    setTimeout(() => {
      const multipliers = industryMultipliers[data.industry as Industry];
      
      const profit = data.revenue - data.opex;

      // 1. Earnings-Based Method
      const revenueValuation = data.revenue * multipliers.revenue;
      const profitValuation = profit * multipliers.profit;
      const sde = profit + (data.ownerSalary || 0) + (data.addBacks || 0);
      const sdeValuation = sde * multipliers.sde;

      // 2. DCF Method (using UFCF)
      let futureCashFlows = [];
      let lastYearRevenue = data.revenue;
      
      for (let i = 1; i <= 5; i++) {
        lastYearRevenue *= (1 + data.growthRate / 100);
        const projectedEbit = (lastYearRevenue * (profit / data.revenue)); // Assume stable margin
        const ebitdaMinusTaxes = projectedEbit * (1 - data.taxRate / 100);
        const ufcf = ebitdaMinusTaxes + data.depreciation - data.capex - data.workingCapitalChange;
        futureCashFlows.push(ufcf);
      }
      
      const lastUFCF = futureCashFlows[futureCashFlows.length - 1];
      const perpetualGrowthRate = 0.03; // Assume 3% perpetual growth
      const terminalValue = (lastUFCF * (1 + perpetualGrowthRate)) / (data.discountRate/100 - perpetualGrowthRate);

      let dcfValuation = 0;
      if (terminalValue > 0 && isFinite(terminalValue)) {
          const allFutureValues = [...futureCashFlows, terminalValue];
          dcfValuation = allFutureValues.reduce((acc, cf, i) => {
            return acc + (cf / Math.pow(1 + data.discountRate / 100, i + 1));
          }, 0);
      } else {
        dcfValuation = futureCashFlows.reduce((acc, cf, i) => {
            return acc + (cf / Math.pow(1 + data.discountRate / 100, i + 1));
          }, 0);
      }

      // 3. Asset-Based Method
      const navValuation = (data.totalAssets || 0) - (data.totalLiabilities || 0);

      setValuationResult({
        earningsValuation: { revenue: revenueValuation, profit: profitValuation, sde: sdeValuation },
        dcfValuation: dcfValuation,
        assetValuation: { nav: navValuation }
      });
      setIsLoading(false);
    }, 1500);
  };
  
  const handleAiPrompt = async (prompt: string) => {
    if (!prompt) {
      toast({ title: 'AI Info', description: 'Please enter a description, e.g., "a 2-year old SaaS company with $500k revenue"' });
      return;
    }
    setIsProcessingAi(true);
    try {
        const result = await handleFinancialsGeneration(prompt);
        if (result.error) {
            throw new Error(result.error);
        }
        
        const aiData = result.data as Omit<ValuationFormData, 'industry'>;
        form.reset({
            ...form.getValues(),
            ...aiData,
        });

        toast({ title: 'AI Success', description: 'Financials populated from your prompt.'});
    } catch(e: any) {
        toast({ title: 'AI Error', description: e.message || 'Failed to generate financials from prompt.', variant: 'destructive'});
    } finally {
        setIsProcessingAi(false);
    }
  };

  const formatCurrency = (amount: number) => {
    const selectedCountry = countries.find(c => c.code === country);
    if (!selectedCountry) return amount.toString();

    return new Intl.NumberFormat(selectedCountry.locale, { 
        style: 'currency', 
        currency: selectedCountry.currency, 
        notation: 'compact',
        maximumFractionDigits: 2 
    }).format(amount);
  }

  const formatCurrencyFull = (amount: number) => {
    const selectedCountry = countries.find(c => c.code === country);
    if (!selectedCountry) return amount.toString();
    return new Intl.NumberFormat(selectedCountry.locale, {
      style: 'currency',
      currency: selectedCountry.currency,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-8">
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Disclaimer: For Educational & Illustrative Use Only</AlertTitle>
        <AlertDescription>
          Business valuation is complex. This tool uses simplified models and should not be used for investment decisions. Always consult a qualified financial professional.
        </AlertDescription>
      </Alert>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        <div className="space-y-6 md:col-span-2">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Settings</CardTitle>
                    </CardHeader>
                     <CardContent>
                        <FormLabel>Currency / Region</FormLabel>
                        <Select value={country} onValueChange={(val) => setCountry(val as Country)}>
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select Country" />
                            </SelectTrigger>
                            <SelectContent>
                                {countries.map(c => <SelectItem key={c.code} value={c.code}> <Globe className="inline-block mr-2 h-4 w-4"/> {c.name} ({c.currency})</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </CardContent>
                </Card>
                <Card>
                     <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Sparkles className="text-primary"/> AI Assistant
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground mb-2">
                          e.g., "A 3-year old profitable Shopify store doing $1M in sales"
                        </p>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.currentTarget);
                            const prompt = formData.get('ai-prompt') as string;
                            handleAiPrompt(prompt);
                        }}>
                            <div className="flex gap-2">
                                <Input name="ai-prompt" placeholder="Describe a business..." disabled={isProcessingAi} />
                                <Button type="submit" disabled={isProcessingAi}>
                                  {isProcessingAi ? <Loader2 className="animate-spin" /> : 'Generate'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
                <Card>
                  <CardHeader><CardTitle>Financial Inputs</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                     <FormField control={form.control} name="revenue" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Last 12 Months Revenue ({country})</FormLabel>
                            <FormControl><Input type="number" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                     <FormField control={form.control} name="opex" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Operating Expenses (Opex, ex-Depr.) ({country})</FormLabel>
                            <FormControl><Input type="number" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                     <FormField control={form.control} name="depreciation" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Depreciation & Amortization ({country})</FormLabel>
                            <FormControl><Input type="number" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                     <FormField control={form.control} name="capex" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Capital Expenditures (CAPEX) ({country})</FormLabel>
                            <FormControl><Input type="number" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                     <FormField control={form.control} name="workingCapitalChange" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Annual Change in Working Capital ({country})</FormLabel>
                            <FormControl><Input type="number" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                     <FormField control={form.control} name="taxRate" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Corporate Tax Rate: {field.value}%</FormLabel>
                            <FormControl><Slider min={0} max={100} step={1} onValueChange={(v) => field.onChange(v[0])} defaultValue={[field.value]} /></FormControl>
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
                            <FormControl><Slider min={-50} max={100} step={1} onValueChange={(v) => field.onChange(v[0])} defaultValue={[field.value]} /></FormControl>
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
                    <FormField control={form.control} name="ownerSalary" render={({ field }) => (
                        <FormItem><FormLabel>Owner's Salary ({country})</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>
                    )} />
                     <FormField control={form.control} name="addBacks" render={({ field }) => (
                        <FormItem><FormLabel>Discretionary Expenses / Add-backs ({country})</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>
                    )} />
                    <FormField control={form.control} name="totalAssets" render={({ field }) => (
                        <FormItem><FormLabel>Total Assets ({country})</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>
                    )} />
                    <FormField control={form.control} name="totalLiabilities" render={({ field }) => (
                        <FormItem><FormLabel>Total Liabilities ({country})</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>
                    )} />
                  </CardContent>
                </Card>
                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Calculating...</> : <><Calculator className="mr-2 h-4 w-4" />Calculate Valuation</>}
                </Button>
              </form>
            </Form>
        </div>
        <div className="md:col-span-3">
            {isLoading ? (
                 <Card className="flex items-center justify-center text-center p-8 h-full">
                    <div>
                        <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary mb-4" />
                        <p className="text-muted-foreground">Running valuation models...</p>
                    </div>
                </Card>
            ) : valuationResult ? (
                 <Tabs defaultValue="earnings" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="earnings"><DollarSign/>Earnings-Based</TabsTrigger>
                      <TabsTrigger value="dcf"><LineChart/>DCF</TabsTrigger>
                      <TabsTrigger value="assets"><Landmark/>Asset-Based</TabsTrigger>
                    </TabsList>
                    <TabsContent value="earnings" className="mt-4">
                        <Card>
                             <CardHeader>
                                <CardTitle className="flex items-center gap-2"><PieChart className="text-primary"/>Earnings & Revenue Multiples</CardTitle>
                                <CardDescription>Valuation based on industry-standard multiples for revenue, profit, and SDE.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="p-4 bg-muted rounded-lg text-center">
                                    <p className="text-sm text-muted-foreground">Based on Revenue</p>
                                    <p className="text-2xl font-bold text-primary">{formatCurrency(valuationResult.earningsValuation.revenue)}</p>
                                </div>
                                <div className="p-4 bg-muted rounded-lg text-center">
                                    <p className="text-sm text-muted-foreground">Based on Profit/EBITDA</p>
                                    <p className="text-2xl font-bold text-primary">{formatCurrency(valuationResult.earningsValuation.profit)}</p>
                                </div>
                                 <div className="p-4 bg-muted rounded-lg text-center">
                                    <p className="text-sm text-muted-foreground">Based on SDE</p>
                                    <p className="text-2xl font-bold text-primary">{formatCurrency(valuationResult.earningsValuation.sde)}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="dcf" className="mt-4">
                         <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2"><LineChart className="text-primary"/>Discounted Cash Flow (DCF)</CardTitle>
                                <CardDescription>Valuation based on the present value of projected future cash flows.</CardDescription>
                            </CardHeader>
                            <CardContent className="text-center">
                                 <div className="p-4 bg-muted rounded-lg">
                                    <p className="text-sm text-muted-foreground">5-Year Unlevered DCF Valuation</p>
                                    <p className="text-3xl font-bold text-primary">{formatCurrency(valuationResult.dcfValuation)}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="assets" className="mt-4">
                         <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2"><Scale className="text-primary"/>Asset-Based</CardTitle>
                                <CardDescription>Valuation based on the company's balance sheet (book value).</CardDescription>
                            </CardHeader>
                            <CardContent className="text-center">
                                 <div className="p-4 bg-muted rounded-lg">
                                    <p className="text-sm text-muted-foreground">Net Asset Value (NAV)</p>
                                    <p className="text-3xl font-bold text-primary">{formatCurrency(valuationResult.assetValuation.nav)}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                  </Tabs>
            ) : (
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

    