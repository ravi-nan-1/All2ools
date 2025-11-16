"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/use-language';
import { Loader2, BadgeDollarSign, FileText, Lightbulb, Info, Coins } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { handleTaxAnalysis } from '@/app/actions';

const formSchema = z.object({
  income: z.number().positive({ message: 'Income must be a positive number.' }),
  expenses: z.number().positive({ message: 'Expenses must be a positive number.' }),
  country: z.string().min(2, { message: 'Please enter your country.'}),
  categoryTags: z.string().min(3, { message: 'Please enter at least one category tag.' }),
});

type FormValues = z.infer<typeof formSchema>;

type AnalysisResult = {
  estimatedSavings: string;
  deductionList: string;
  documentsNeeded: string;
  tips: string;
};

export function AiTaxDeductionFinder() {
  const { toast } = useToast();
  const { translate } = useLanguage();
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      income: undefined,
      expenses: undefined,
      country: '',
      categoryTags: '',
    },
    mode: 'onChange',
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append('income', data.income.toString());
    formData.append('expenses', data.expenses.toString());
    formData.append('country', data.country);
    formData.append('categoryTags', data.categoryTags);

    try {
      const analysisResult = await handleTaxAnalysis(formData);
      if (analysisResult.error) {
        throw new Error(analysisResult.error);
      }
      setResult(analysisResult.result as AnalysisResult);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast({
        title: 'Error Analyzing Deductions',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'><Info className='text-primary' /> Sample Formats</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p><strong>Country:</strong> e.g., United States, Germany, India</p>
            <p><strong>Category Tags:</strong> e.g., home office, business travel, software, marketing</p>
          </CardContent>
        </Card>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="income"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Annual Income (in your local currency)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="e.g., 80000" 
                      {...field}
                      onChange={e => field.onChange(parseFloat(e.target.value))}
                      disabled={isLoading} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="expenses"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Annual Expenses (in your local currency)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="e.g., 20000" 
                      {...field} 
                      onChange={e => field.onChange(parseFloat(e.target.value))}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Country</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., United States" 
                      {...field} 
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categoryTags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expense Category Tags (comma-separated)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="e.g., home office, business travel, software subscriptions"
                      {...field} 
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormItem>
                <FormLabel>Upload Receipts (Optional)</FormLabel>
                <FormControl>
                  <Input type="file" disabled={true} />
                </FormControl>
                <p className="text-sm text-muted-foreground">This feature is coming soon.</p>
              </FormItem>

            <Button type="submit" className="w-full" disabled={isLoading || !form.formState.isValid}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {translate('processing')}
                </>
              ) : (
                translate('analyze_deductions')
              )}
            </Button>
          </form>
        </Form>
      </div>

      <div className="space-y-4">
        <Card className="min-h-[500px] sticky top-24">
          <CardHeader>
            <CardTitle>AI Analysis Result</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading && (
              <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                <p>Analyzing your tax deductions... This may take a moment.</p>
              </div>
            )}
            {!isLoading && !result && (
              <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                <Coins className="h-12 w-12 mb-4 text-primary/50" />
                <p>Your deduction analysis will appear here.</p>
              </div>
            )}
            {result && (
              <div className="space-y-6">
                <div>
                  <h3 className="flex items-center gap-2 text-lg font-semibold mb-2 text-primary"><BadgeDollarSign /> Estimated Tax Savings</h3>
                  <p className="text-2xl font-bold text-green-600">{result.estimatedSavings}</p>
                </div>
                <div>
                  <h3 className="flex items-center gap-2 text-lg font-semibold mb-2 text-primary"><FileText /> Potential Deductions</h3>
                  <pre className="text-sm text-muted-foreground bg-muted p-3 rounded-md whitespace-pre-wrap font-body">{result.deductionList}</pre>
                </div>
                <div>
                   <h3 className="flex items-center gap-2 text-lg font-semibold mb-2 text-primary"><FileText /> Documents Needed</h3>
                   <pre className="text-sm text-muted-foreground bg-muted p-3 rounded-md whitespace-pre-wrap font-body">{result.documentsNeeded}</pre>
                </div>
                 <div>
                   <h3 className="flex items-center gap-2 text-lg font-semibold mb-2 text-primary"><Lightbulb /> Pro Tips</h3>
                   <pre className="text-sm text-muted-foreground bg-muted p-3 rounded-md whitespace-pre-wrap font-body">{result.tips}</pre>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
