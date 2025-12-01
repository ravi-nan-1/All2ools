
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, Sparkles, Copy, FileText, Bot, Link, FileUp, BrainCircuit, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { handleArticleOutlineGeneration } from '@/app/actions';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { GenerateArticleOutlineOutput } from '@/ai/flows/generate-article-outline';

const formSchema = z.object({
  topic: z.string().min(3, 'Topic must be at least 3 characters long.'),
  sourceUrl: z.string().url("Please enter a valid URL.").optional().or(z.literal('')),
  pastedText: z.string().optional(),
  tone: z.string().optional(),
  audience: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function OneClickArticleOutlineGenerator() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GenerateArticleOutlineOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: '',
      sourceUrl: '',
      pastedText: '',
      tone: 'professional',
      audience: 'general',
    },
    mode: 'onChange',
  });
  
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result as string;
            form.setValue('pastedText', text);
            toast({ title: 'File Content Loaded', description: 'The content of your file has been pasted into the text area.' });
        };
        reader.readAsText(file);
    }
  };


  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'Copied to clipboard!' });
  };
  
  const copyOutlineToClipboard = () => {
    if (!result) return;
    
    let text = `# ${result.title}\n\n`;
    text += `## Introduction\n${result.introduction}\n\n`;
    result.sections.forEach(section => {
        text += `## ${section.heading}\n`;
        section.subsections?.forEach(sub => {
            text += `### ${sub.heading}\n`;
            sub.points.forEach(p => {
                text += `- ${p}\n`;
            });
        });
        text += '\n';
    });
    text += `## Conclusion\n${result.conclusion}\n\n`;
    if(result.faq && result.faq.length > 0) {
        text += `## Frequently Asked Questions\n`;
        result.faq.forEach(f => {
            text += `### ${f.question}\n${f.answer}\n\n`;
        });
    }

    copyToClipboard(text);
  };

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    setResult(null);

    try {
      const response = await handleArticleOutlineGeneration(data);
      if (response.error) {
        throw new Error(response.error);
      }
      setResult(response.data as GenerateArticleOutlineOutput);
      toast({
        title: 'Outline Generated!',
        description: 'Your AI-powered article outline is ready.',
      });
    } catch (error: any) {
      toast({
        title: 'Generation Failed',
        description: error.message || 'An unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Article Topic & Context</CardTitle>
                <CardDescription>Enter a topic, or provide a URL/text for context.</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="topic" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="topic">Topic</TabsTrigger>
                    <TabsTrigger value="url">From URL</TabsTrigger>
                    <TabsTrigger value="paste">Paste Text</TabsTrigger>
                  </TabsList>
                  <TabsContent value="topic" className="mt-4">
                     <FormField
                      control={form.control}
                      name="topic"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Article Topic</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 'The benefits of content marketing'" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>
                   <TabsContent value="url" className="mt-4 space-y-4">
                     <FormField
                      control={form.control}
                      name="topic"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Topic (required)</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 'Content marketing strategies'" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="sourceUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2"><Link className="h-4 w-4"/>Source URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://example.com/article-to-base-outline-on" {...field} />
                          </FormControl>
                           <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>
                   <TabsContent value="paste" className="mt-4 space-y-4">
                     <FormField
                      control={form.control}
                      name="topic"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Topic (required)</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 'Keyword clustering'" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="pastedText"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pasted Text (notes, keywords, draft)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Paste your content here..."
                              rows={8}
                              {...field}
                            />
                          </FormControl>
                           <FormMessage />
                        </FormItem>
                      )}
                    />
                     <label htmlFor="file-upload" className="w-full">
                        <Button variant="outline" className="w-full" asChild>
                            <span><FileUp className="mr-2"/> Upload TXT File</span>
                        </Button>
                        <Input id="file-upload" type="file" className="hidden" accept=".txt" onChange={handleFileUpload} />
                    </label>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Customization</CardTitle>
                <CardDescription>Tailor the outline to your specific needs.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="tone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2"><BrainCircuit />Tone of Voice</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a tone" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="professional">Professional & Authoritative</SelectItem>
                          <SelectItem value="friendly">Friendly & Casual</SelectItem>
                          <SelectItem value="expert">Expert & Technical</SelectItem>
                          <SelectItem value="engaging">Engaging & Persuasive</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="audience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2"><Users />Target Audience</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an audience" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="general">General Audience</SelectItem>
                          <SelectItem value="beginners">Beginners</SelectItem>
                          <SelectItem value="intermediate">Intermediate</SelectItem>
                          <SelectItem value="experts">Experts / Professionals</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
            
            <Button type="submit" className="w-full h-12 text-lg" disabled={isLoading || !form.formState.isValid}>
              {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Sparkles className="mr-2 h-5 w-5" />}
              Generate Outline
            </Button>
          </form>
        </Form>
      </div>
      <div className="lg:col-span-3 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
                <span>Generated Outline</span>
                <Button variant="ghost" size="sm" onClick={copyOutlineToClipboard} disabled={!result}>
                    <Copy className="mr-2 h-4 w-4" /> Copy All
                </Button>
            </CardTitle>
            <CardDescription>
              An SEO-friendly structure for your article, created by AI.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading && (
              <div className="flex flex-col items-center justify-center text-center p-8 h-96">
                <Bot className="h-12 w-12 text-primary animate-bounce mb-4" />
                <h3 className="text-xl font-semibold">Generating Outline...</h3>
                <p className="text-muted-foreground max-w-sm">
                  The AI is structuring your article. This may take a moment.
                </p>
              </div>
            )}
            {!isLoading && !result && (
              <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg h-96 flex items-center justify-center">
                <div className="space-y-2">
                    <FileText className="mx-auto h-12 w-12" />
                    <p>Your article outline will appear here.</p>
                </div>
              </div>
            )}
            {!isLoading && result && (
              <div className="space-y-6">
                <div className='p-4 border rounded-lg bg-background'>
                    <h1 className="text-2xl font-bold font-headline">{result.title}</h1>
                    <p className='text-muted-foreground mt-2'>{result.introduction}</p>
                </div>
                
                <Accordion type="multiple" className="w-full" defaultValue={result.sections.map(s => s.heading)}>
                  {result.sections.map((section, index) => (
                    <AccordionItem value={section.heading} key={index}>
                      <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                        <div className="flex items-center gap-3 text-left">
                            <Badge variant="secondary">{`H2`}</Badge>
                            <span>{section.heading}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-4 pl-8 pt-4">
                        {section.subsections?.map((subsection, subIndex) => (
                          <div key={subIndex} className="border-l-2 pl-4">
                            <h4 className="font-semibold text-md flex items-center gap-2"><Badge variant="outline">{`H3`}</Badge>{subsection.heading}</h4>
                            <ul className="list-disc pl-5 mt-2 space-y-1 text-muted-foreground">
                              {subsection.points.map((point, pointIndex) => (
                                <li key={pointIndex}>{point}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>

                 <div className='p-4 border rounded-lg bg-background'>
                    <h2 className="text-xl font-bold">Conclusion</h2>
                    <p className='text-muted-foreground mt-2'>{result.conclusion}</p>
                </div>

                {result.faq && result.faq.length > 0 && (
                     <div className='p-4 border rounded-lg bg-background'>
                        <h2 className="text-xl font-bold">Frequently Asked Questions</h2>
                         <Accordion type="multiple" className="w-full mt-2">
                            {result.faq.map((item, index) => (
                                <AccordionItem value={item.question} key={index}>
                                    <AccordionTrigger className="font-semibold text-left">{item.question}</AccordionTrigger>
                                    <AccordionContent className="text-muted-foreground">{item.answer}</AccordionContent>
                                </AccordionItem>
                            ))}
                         </Accordion>
                    </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
