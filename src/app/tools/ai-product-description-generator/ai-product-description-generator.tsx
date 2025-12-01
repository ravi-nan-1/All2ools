
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
import { Loader2, Sparkles, Copy, ShoppingBag, Users, BrainCircuit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { handleProductDescriptionGeneration } from '@/app/actions';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { GenerateProductDescriptionOutput } from '@/ai/flows/generate-product-description';


const formSchema = z.object({
  productName: z.string().min(3, 'Product name must be at least 3 characters.'),
  features: z.string().min(10, 'Please list at least one key feature.'),
  targetAudience: z.string().min(3, 'Target audience is required.'),
  tone: z.string().min(1, 'Please select a tone.'),
});

type FormValues = z.infer<typeof formSchema>;

export function AiProductDescriptionGenerator() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GenerateProductDescriptionOutput | null>(null);
  const [activeTab, setActiveTab] = useState('shopify');
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productName: '',
      features: '',
      targetAudience: '',
      tone: 'persuasive',
    },
    mode: 'onChange',
  });
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied to clipboard!" });
  };

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    setResult(null);

    try {
      const response = await handleProductDescriptionGeneration(data);
      if (response.error) {
        throw new Error(response.error);
      }
      setResult(response.data as GenerateProductDescriptionOutput);
      toast({
        title: 'Descriptions Generated!',
        description: 'Your AI-powered product descriptions are ready.',
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
                <CardTitle>Product Details</CardTitle>
                <CardDescription>Enter your product information below to generate descriptions.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="productName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='flex items-center gap-2'><ShoppingBag/>Product Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 'Eco-Friendly Bamboo Toothbrush'" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="features"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='flex items-center gap-2'><Sparkles/>Key Features & Benefits</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="List the main features, one per line. e.g.,&#10;- 100% biodegradable handle&#10;- Soft, charcoal-infused bristles&#10;- Vegan and cruelty-free"
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="targetAudience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='flex items-center gap-2'><Users/>Target Audience</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 'Eco-conscious millennials'" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="tone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='flex items-center gap-2'><BrainCircuit/>Tone of Voice</FormLabel>
                       <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a tone" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="persuasive">Persuasive & Exciting</SelectItem>
                          <SelectItem value="professional">Professional & Technical</SelectItem>
                          <SelectItem value="friendly">Friendly & Casual</SelectItem>
                          <SelectItem value="luxury">Luxury & Elegant</SelectItem>
                          <SelectItem value="minimalist">Minimalist & Direct</SelectItem>
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
              Generate Descriptions
            </Button>
          </form>
        </Form>
      </div>
      <div className="lg:col-span-3 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Generated Descriptions</CardTitle>
            <CardDescription>
              AI-generated content for various e-commerce platforms.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading && (
              <div className="flex flex-col items-center justify-center text-center p-8 h-96">
                <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
                <h3 className="text-xl font-semibold">Generating Content...</h3>
                <p className="text-muted-foreground max-w-sm">
                  The AI is crafting compelling descriptions for your product.
                </p>
              </div>
            )}
            {!isLoading && !result && (
              <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg h-96 flex items-center justify-center">
                <p>Your product descriptions will appear here.</p>
              </div>
            )}
            {!isLoading && result && (
              <div className="space-y-6">
                <div className="flex justify-center flex-wrap gap-2">
                    <Button variant={activeTab === 'shopify' ? 'default' : 'outline'} onClick={() => setActiveTab('shopify')}>Shopify / General</Button>
                    <Button variant={activeTab === 'amazon' ? 'default' : 'outline'} onClick={() => setActiveTab('amazon')}>Amazon</Button>
                    <Button variant={activeTab === 'social' ? 'default' : 'outline'} onClick={() => setActiveTab('social')}>Social Media</Button>
                </div>
                
                {activeTab === 'shopify' && (
                    <Card>
                        <CardHeader><CardTitle>Shopify / General E-commerce</CardTitle></CardHeader>
                        <CardContent className='space-y-4'>
                            <div className="space-y-2">
                                <h4 className="font-semibold text-sm">Product Title</h4>
                                <div className="flex items-start gap-2">
                                    <p className="text-sm p-3 bg-muted rounded-md text-muted-foreground flex-grow">{result.shopify.title}</p>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => copyToClipboard(result.shopify.title)}><Copy/></Button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <h4 className="font-semibold text-sm">Product Description</h4>
                                <div className="flex items-start gap-2">
                                     <div className="text-sm p-3 bg-muted rounded-md text-muted-foreground flex-grow prose prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: result.shopify.description.replace(/\n/g, '<br/>') }}></div>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => copyToClipboard(result.shopify.description)}><Copy/></Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
                 {activeTab === 'amazon' && (
                    <Card>
                        <CardHeader><CardTitle>Amazon Listing</CardTitle></CardHeader>
                        <CardContent className='space-y-4'>
                            <div className="space-y-2">
                                <h4 className="font-semibold text-sm">Product Title</h4>
                                <div className="flex items-start gap-2">
                                    <p className="text-sm p-3 bg-muted rounded-md text-muted-foreground flex-grow">{result.amazon.title}</p>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => copyToClipboard(result.amazon.title)}><Copy/></Button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <h4 className="font-semibold text-sm">Bullet Points</h4>
                                <div className="flex items-start gap-2">
                                     <div className="text-sm p-3 bg-muted rounded-md text-muted-foreground flex-grow prose prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: result.amazon.bulletPoints.map(b => `• ${b}`).join('<br/>') }}></div>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => copyToClipboard(result.amazon.bulletPoints.join('\n'))}><Copy/></Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
                 {activeTab === 'social' && (
                    <Card>
                        <CardHeader><CardTitle>Social Media Posts</CardTitle></CardHeader>
                        <CardContent className='space-y-4'>
                            <div className="space-y-2">
                                <h4 className="font-semibold text-sm">Instagram Post</h4>
                                <div className="flex items-start gap-2">
                                    <p className="text-sm p-3 bg-muted rounded-md text-muted-foreground flex-grow whitespace-pre-wrap">{result.socialMedia.instagram}</p>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => copyToClipboard(result.socialMedia.instagram)}><Copy/></Button>
                                </div>
                            </div>
                             <div className="space-y-2">
                                <h4 className="font-semibold text-sm">Facebook Post</h4>
                                <div className="flex items-start gap-2">
                                    <p className="text-sm p-3 bg-muted rounded-md text-muted-foreground flex-grow whitespace-pre-wrap">{result.socialMedia.facebook}</p>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => copyToClipboard(result.socialMedia.facebook)}><Copy/></Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
