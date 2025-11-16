"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { handleContentAnalysis } from '@/app/actions';
import { useLanguage } from '@/hooks/use-language';
import { Loader2, PlusCircle, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const formSchema = z.object({
  text: z.string().min(50, { message: "Please enter at least 50 characters to analyze." }),
  competitorUrls: z.array(z.object({
    value: z.string().url({ message: "Please enter a valid URL." })
  })).min(1, "Please add at least one competitor URL.").max(5, "You can add up to 5 competitor URLs."),
});

type FormValues = z.infer<typeof formSchema>;

export function ContentGapAnalyzer() {
  const { toast } = useToast();
  const { translate } = useLanguage();
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: "",
      competitorUrls: [{ value: "" }],
    },
    mode: 'onChange',
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "competitorUrls",
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append('text', data.text);
    data.competitorUrls.forEach(url => {
      if (url.value) {
        formData.append('competitorUrls', url.value);
      }
    });
    
    try {
      const analysisResult = await handleContentAnalysis(formData);
      if (analysisResult.error) {
        throw new Error(analysisResult.error);
      }
      setResult(analysisResult.advice as string);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast({
        title: 'Error analyzing content',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        {translate('analyze_text_for_seo')}
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="text"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Content</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Paste the content of your page here..."
                    rows={10}
                    className="w-full"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <FormLabel>Top Competitor URLs</FormLabel>
            <p className="text-sm text-muted-foreground mb-2">Add up to 5 URLs of pages that are ranking for your target keyword.</p>
            <div className="space-y-2">
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-2">
                <FormField
                  control={form.control}
                  name={`competitorUrls.${index}.value`}
                  render={({ field }) => (
                    <FormItem className="flex-grow">
                      <FormControl>
                        <Input placeholder={`https://competitor.com/blog/your-keyword`} {...field} disabled={isLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} disabled={isLoading || fields.length <= 1}>
                  <Trash2 className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>
            ))}
            </div>
            {fields.length < 5 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => append({ value: "" })}
                disabled={isLoading}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Competitor
              </Button>
            )}
          </div>

          <Button type="submit" disabled={isLoading || !form.formState.isValid}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {translate('processing')}
              </>
            ) : (
              translate('analyze_text')
            )}
          </Button>
        </form>
      </Form>
      
      {(isLoading || result) && (
        <Card className="mt-6 border-primary/20 bg-background">
          <CardHeader>
            <CardTitle>{translate('result')}</CardTitle>

          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                <span>Analyzing content against competitors... This may take a moment.</span>
              </div>
            ) : (
               result && (
                <div className="space-y-4">
                    <h3 className='text-lg font-semibold text-primary'>{translate('advice')}</h3>
                    <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground whitespace-pre-wrap font-body">{result}</div>
                </div>
               )
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
