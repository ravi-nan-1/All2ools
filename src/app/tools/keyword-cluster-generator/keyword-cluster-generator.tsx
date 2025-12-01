'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Papa from 'papaparse';
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
import { Loader2, PlusCircle, Sparkles, Trash2, UploadCloud, FileText, File, Merge, Split, HelpCircle, ChevronsUpDown, ChevronsDownUp, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { handleKeywordClusterGeneration } from '@/app/actions';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

const formSchema = z.object({
  primaryKeyword: z.string().min(1, 'Primary keyword is required.'),
  secondaryKeywords: z.array(z.object({
    value: z.string().min(1, "Keyword cannot be empty."),
  })).min(5, 'At least 5 secondary keywords are required.'),
});

type FormValues = z.infer<typeof formSchema>;

interface Cluster {
    clusterTitle: string;
    parentTopic: string;
    intent: 'Informational' | 'Transactional' | 'Commercial' | 'Navigational' | 'Unknown';
    relevanceScore: number;
    difficultyScore: number;
    keywords: string[];
    aiSeoTitle: string;
    aiMetaDescription: string;
    aiContentBrief: string;
    aiKeywordExpansion: {
        related: string[];
        questions: string[];
    };
}

interface ClusterResult {
    clusters: Cluster[];
    aiPillarPageSuggestion: string;
}

const intentColors = {
    Informational: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    Transactional: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    Commercial: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    Navigational: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    Unknown: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
}

export function KeywordClusterGenerator() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ClusterResult | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      primaryKeyword: '',
      secondaryKeywords: [{ value: '' }],
    },
    mode: 'onChange',
  });

  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: 'secondaryKeywords',
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      Papa.parse(file, {
        complete: (results) => {
          const keywords = (results.data as string[][]).flat().map(k => k.trim()).filter(Boolean);
          const uniqueKeywords = [...new Set(keywords)];
          replace(uniqueKeywords.map(k => ({ value: k })));
          toast({ title: "Keywords Imported", description: `${uniqueKeywords.length} unique keywords were loaded from the file.`});
        },
        error: (error) => {
            toast({ title: "Import Error", description: `Failed to parse file: ${error.message}`, variant: 'destructive'});
        }
      });
    }
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLTextAreaElement>) => {
    event.preventDefault();
    const pasteData = event.clipboardData.getData('text');
    const keywords = pasteData.split(/\r?\n/).map(k => k.trim()).filter(Boolean);
    if (keywords.length > 0) {
      const uniqueKeywords = [...new Set(keywords)];
      replace(uniqueKeywords.map(k => ({ value: k })));
      toast({ title: "Keywords Pasted", description: `${uniqueKeywords.length} unique keywords were pasted and added.`});
    }
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied to clipboard!" });
  };

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append('primaryKeyword', data.primaryKeyword);
    const uniqueKeywords = [...new Set(data.secondaryKeywords.map(kw => kw.value).filter(Boolean))];
    uniqueKeywords.forEach(kw => {
        formData.append('secondaryKeywords', kw);
    });

    try {
      const response = await handleKeywordClusterGeneration(formData);
      if (response.error) {
        throw new Error(response.error);
      }
      setResult(response.data as ClusterResult);
      toast({
        title: 'Clusters Generated!',
        description: 'Your advanced keyword clusters are ready below.',
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
                    <CardTitle>1. Import Keywords</CardTitle>
                    <CardDescription>Upload a file or paste your keywords. Duplicates will be removed.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div>
                        <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-background transition-colors">
                            <div className="flex flex-col items-center justify-center text-center">
                                <UploadCloud className="w-8 h-8 mb-2 text-muted-foreground" />
                                {fileName ? (
                                    <p className="font-semibold text-primary text-sm break-all px-2">{fileName}</p>
                                ) : (
                                <>
                                    <p className="text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag & drop</p>
                                    <p className="text-xs text-muted-foreground">CSV, TXT, or Excel</p>
                                </>
                                )}
                            </div>
                            <Input id="file-upload" type="file" className="hidden" accept=".csv,.txt,.xlsx,.xls" onChange={handleFileChange} />
                        </label>
                    </div>
                     <div>
                      <Textarea
                        placeholder="Or paste your keywords here, one per line..."
                        onPaste={handlePaste}
                        rows={6}
                        />
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>2. Enter Keywords Manually</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <FormField
                    control={form.control}
                    name="primaryKeyword"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Primary / Parent Keyword</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g., 'content marketing'" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                    <FormLabel>Secondary Keywords ({[...new Set(form.watch('secondaryKeywords').map(f => f.value).filter(Boolean))].length})</FormLabel>
                    {fields.map((field, index) => (
                        <div key={field.id} className="flex items-center gap-2">
                        <FormField
                            control={form.control}
                            name={`secondaryKeywords.${index}.value`}
                            render={({ field }) => (
                            <FormItem className="flex-grow">
                                <FormControl>
                                <Input placeholder="Enter a secondary keyword..." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => remove(index)}
                        >
                            <Trash2 className="h-4 w-4 text-muted-foreground" />
                        </Button>
                        </div>
                    ))}
                    </div>

                    <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => append({ value: '' })}
                    >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Keyword
                    </Button>
                </CardContent>
            </Card>
            
            <Button type="submit" className="w-full h-12 text-lg" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin"/> : <Sparkles className="mr-2 h-5 w-5" />}
                Generate Clusters
            </Button>
          </form>
        </Form>
      </div>
      <div className="lg:col-span-3 space-y-4">
        <Card>
            <CardHeader>
                <CardTitle>Generated Keyword Clusters</CardTitle>
                <CardDescription>
                    AI-powered semantic groups with intent, difficulty, and content strategy suggestions.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading && (
                    <div className="flex flex-col items-center justify-center text-center p-8 h-96">
                        <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
                        <h3 className="text-xl font-semibold">Generating Clusters...</h3>
                        <p className="text-muted-foreground max-w-sm">
                            Analyzing SERP intent and semantic relationships. This can take a moment.
                        </p>
                    </div>
                )}
                {!isLoading && !result && (
                    <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg h-96 flex items-center justify-center">
                        <p>Your keyword clusters will appear here.</p>
                    </div>
                )}
                {!isLoading && result && (
                    <div className="space-y-6">
                        <Alert className="bg-primary/5 border-primary/20">
                            <Sparkles className="h-4 w-4 text-primary" />
                            <AlertTitle className="text-primary font-bold">AI Pillar Page Strategy</AlertTitle>
                            <AlertDescription>
                                {result.aiPillarPageSuggestion}
                            </AlertDescription>
                        </Alert>
                        <Accordion type="multiple" className="w-full" defaultValue={result.clusters.map(c => c.clusterTitle)}>
                            {result.clusters.map((cluster, index) => (
                                <AccordionItem value={cluster.clusterTitle} key={index}>
                                    <AccordionTrigger className="text-base font-semibold hover:no-underline">
                                        <div className="flex flex-col md:flex-row md:items-center gap-2 text-left">
                                            <span>{cluster.clusterTitle}</span>
                                            <div className="flex gap-2 items-center">
                                                <Badge variant="outline" className={intentColors[cluster.intent]}>{cluster.intent}</Badge>
                                                <Badge variant="secondary">Parent: {cluster.parentTopic}</Badge>
                                            </div>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="space-y-6">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <p className="font-semibold flex items-center gap-1"><ChevronsUpDown className="h-4 w-4 text-muted-foreground"/>Cluster Relevance</p>
                                                <div className="flex items-center gap-2">
                                                    <Progress value={cluster.relevanceScore} className="w-full" />
                                                    <span className="font-bold">{cluster.relevanceScore}%</span>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="font-semibold flex items-center gap-1"><ChevronsDownUp className="h-4 w-4 text-muted-foreground"/>SEO Difficulty</p>
                                                <div className="flex items-center gap-2">
                                                    <Progress value={cluster.difficultyScore} className="w-full" />
                                                    <span className="font-bold">{cluster.difficultyScore}/100</span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="p-3 bg-muted/50 rounded-md">
                                             <h4 className="font-semibold text-sm mb-2">Original Keywords in Cluster</h4>
                                             <div className="flex flex-wrap gap-2">
                                                {cluster.keywords.map((keyword, kwIndex) => (
                                                    <Badge key={kwIndex} variant="secondary">{keyword}</Badge>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <h4 className="font-semibold text-sm">AI-Suggested SEO Title</h4>
                                                <div className="flex items-start gap-2">
                                                    <p className="text-sm p-2 bg-muted/50 rounded-md text-muted-foreground flex-grow">"{cluster.aiSeoTitle}"</p>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => copyToClipboard(cluster.aiSeoTitle)}><Copy/></Button>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <h4 className="font-semibold text-sm">AI-Suggested Meta Description</h4>
                                                <div className="flex items-start gap-2">
                                                    <p className="text-sm p-2 bg-muted/50 rounded-md text-muted-foreground flex-grow">"{cluster.aiMetaDescription}"</p>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => copyToClipboard(cluster.aiMetaDescription)}><Copy/></Button>
                                                </div>
                                            </div>
                                        </div>
                                        
                                         <div className="space-y-2">
                                            <h4 className="font-semibold text-sm">AI Content Brief</h4>
                                            <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground whitespace-pre-wrap p-3 bg-muted/50 rounded-md">{cluster.aiContentBrief}</div>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <h4 className="font-semibold text-sm">AI Keyword Expansion (Related)</h4>
                                                <div className="flex flex-wrap gap-2 p-2 bg-muted/50 rounded-md">
                                                    {cluster.aiKeywordExpansion.related.map((kw, i) => <Badge key={i} variant="outline">{kw}</Badge>)}
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <h4 className="font-semibold text-sm">AI Keyword Expansion (Questions)</h4>
                                                <div className="flex flex-wrap gap-2 p-2 bg-muted/50 rounded-md">
                                                    {cluster.aiKeywordExpansion.questions.map((q, i) => <Badge key={i} variant="outline">{q}</Badge>)}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex gap-2 pt-4 border-t">
                                            <Button variant="ghost" size="sm" disabled><Merge className="mr-2"/>Merge Cluster</Button>
                                            <Button variant="ghost" size="sm" disabled><Split className="mr-2"/>Split Cluster</Button>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                         </Accordion>
                    </div>
                )}
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
