
"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2, Banknote, Landmark, Building, University } from 'lucide-react';

const formSchema = z.object({
  loanAmount: z.number().min(1000, "Must be at least 1,000").max(10000000, "Must be at most 1,00,00,000 / 1,000,000"),
  annualIncome: z.number().min(10000, "Must be at least 10,000").max(50000000, "Must be at most 5,00,00,000 / 5,000,000"),
  creditScore: z.number().min(300, "Invalid score").max(850, "Invalid score"), // US max is 850
  loanTenure: z.number().min(1, "Must be at least 1 year").max(30, "Must be at most 30 years"),
});

type LoanFormData = z.infer<typeof formSchema>;

interface Bank {
    name: string;
    logo: React.ReactNode;
    baseRate: number;
}

interface LoanOffer {
    bankName: string;
    interestRate: number;
    monthlyPayment: number;
    totalPayment: number;
    bankLogo: React.ReactNode;
}

const indianBanks: Bank[] = [
    { name: 'HDFC Bank', logo: <Building className="text-blue-600" />, baseRate: 10.5 },
    { name: 'State Bank of India', logo: <Landmark className="text-blue-800" />, baseRate: 10.2 },
    { name: 'ICICI Bank', logo: <Building className="text-orange-500" />, baseRate: 10.8 },
    { name: 'Axis Bank', logo: <Building className="text-purple-700" />, baseRate: 11.0 },
    { name: 'Kotak Mahindra Bank', logo: <Building className="text-red-600" />, baseRate: 10.7 }
];

const usBanks: Bank[] = [
    { name: 'Chase Bank', logo: <Landmark className="text-blue-700" />, baseRate: 7.2 },
    { name: 'Bank of America', logo: <University className="text-red-700" />, baseRate: 7.0 },
    { name: 'Wells Fargo', logo: <Landmark className="text-red-500" />, baseRate: 7.5 },
    { name: 'Citibank', logo: <University className="text-blue-500" />, baseRate: 7.3 },
    { name: 'U.S. Bank', logo: <Landmark className="text-indigo-600" />, baseRate: 7.8 }
];

type Country = 'IN' | 'US';

export function GlobalLoanOptimizer() {
    const [loanOffers, setLoanOffers] = useState<LoanOffer[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [country, setCountry] = useState<Country>('US');

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
    const banks = isIndia ? indianBanks : usBanks;

    const form = useForm<LoanFormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            loanAmount: isIndia ? 500000 : 50000,
            annualIncome: isIndia ? 1000000 : 80000,
            creditScore: 750,
            loanTenure: 5
        },
        mode: 'onChange',
        key: country, // Re-mounts the form when country changes
    });
    
    const { reset } = form;
    useEffect(() => {
        reset({
            loanAmount: isIndia ? 500000 : 50000,
            annualIncome: isIndia ? 1000000 : 80000,
            creditScore: 750,
            loanTenure: 5
        });
    }, [country, reset, isIndia]);


    const onSubmit = (data: LoanFormData) => {
        setIsLoading(true);
        setLoanOffers([]);
        
        setTimeout(() => {
            const offers: LoanOffer[] = banks.map(bank => {
                let rate = bank.baseRate;

                const creditScoreFactor = ((data.creditScore - 700) / 150) * (isIndia ? 2.0 : 1.5);
                rate -= creditScoreFactor;

                const incomeToLoanRatio = data.annualIncome / data.loanAmount;
                if (incomeToLoanRatio > (isIndia ? 4 : 3)) {
                    rate -= (isIndia ? 0.75 : 0.5);
                } else if (incomeToLoanRatio < 2) {
                    rate += (isIndia ? 0.75 : 0.5);
                }

                rate += (Math.random() - 0.5) * 0.4; 
                
                const finalRate = Math.max(isIndia ? 8.5 : 5.0, Math.min(isIndia ? 18.0 : 15.0, rate));
                
                const monthlyRate = finalRate / 100 / 12;
                const numberOfPayments = data.loanTenure * 12;
                const monthlyPayment = (data.loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -numberOfPayments));
                const totalPayment = monthlyPayment * numberOfPayments;

                return {
                    bankName: bank.name,
                    interestRate: parseFloat(finalRate.toFixed(2)),
                    monthlyPayment: parseFloat(monthlyPayment.toFixed(2)),
                    totalPayment: parseFloat(totalPayment.toFixed(2)),
                    bankLogo: bank.logo,
                };
            }).sort((a,b) => a.interestRate - b.interestRate);

            setLoanOffers(offers);
            setIsLoading(false);
        }, 1500);
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat(isIndia ? 'en-IN' : 'en-US', { 
            style: 'currency', 
            currency: isIndia ? 'INR' : 'USD', 
            maximumFractionDigits: 0 
        }).format(amount);
    }
    
    return (
        <div className="space-y-8">
           <p className="text-muted-foreground">
                Enter your financial details to see simulated loan offers from banks in your region. This tool helps you understand how factors like credit score and income can affect loan terms.
           </p>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField control={form.control} name="loanAmount" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Loan Amount: {formatCurrency(field.value)}</FormLabel>
                                <FormControl>
                                    <Slider min={isIndia ? 50000 : 5000} max={isIndia ? 10000000 : 500000} step={isIndia ? 10000 : 1000} onValueChange={(vals) => field.onChange(vals[0])} defaultValue={[field.value]} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="annualIncome" render={({ field }) => (
                             <FormItem>
                                <FormLabel>Annual Income: {formatCurrency(field.value)}</FormLabel>
                                <FormControl>
                                    <Slider min={isIndia ? 100000 : 20000} max={isIndia ? 50000000 : 1000000} step={isIndia ? 25000 : 5000} onValueChange={(vals) => field.onChange(vals[0])} defaultValue={[field.value]} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="creditScore" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Credit Score: {field.value}</FormLabel>
                                <FormControl>
                                    <Slider min={300} max={850} step={1} onValueChange={(vals) => field.onChange(vals[0])} defaultValue={[field.value]} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="loanTenure" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Loan Tenure: {field.value} years</FormLabel>
                                <FormControl>
                                    <Slider min={1} max={30} step={1} onValueChange={(vals) => field.onChange(vals[0])} defaultValue={[field.value]} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                    </div>
                     <Button type="submit" className="w-full md:w-auto" disabled={isLoading}>
                        {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Processing...</> : 'Find Best Loans'}
                    </Button>
                </form>
            </Form>

            {isLoading && (
                <div className="flex items-center justify-center text-center p-8">
                    <Loader2 className="mr-4 h-8 w-8 animate-spin text-primary" />
                    <p className="text-muted-foreground">Analyzing offers from {isIndia ? 'Indian' : 'US'} lenders...</p>
                </div>
            )}

            {loanOffers.length > 0 && !isLoading && (
                 <Card>
                    <CardHeader>
                        <CardTitle>Simulated Loan Offers ({country})</CardTitle>
                        <CardDescription>
                            Based on your inputs, here are some estimated loan offers. These are for informational purposes only.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Bank</TableHead>
                                    <TableHead className="text-right">Interest Rate</TableHead>
                                    <TableHead className="text-right">Monthly Payment</TableHead>
                                    <TableHead className="text-right">Total Payment</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loanOffers.map((offer) => (
                                    <TableRow key={offer.bankName}>
                                        <TableCell className="font-medium flex items-center gap-2">
                                            {offer.bankLogo}
                                            {offer.bankName}
                                        </TableCell>
                                        <TableCell className="text-right">{offer.interestRate.toFixed(2)}%</TableCell>
                                        <TableCell className="text-right">{formatCurrency(offer.monthlyPayment)}</TableCell>
                                        <TableCell className="text-right">{formatCurrency(offer.totalPayment)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}
        </div>
    );

}
    