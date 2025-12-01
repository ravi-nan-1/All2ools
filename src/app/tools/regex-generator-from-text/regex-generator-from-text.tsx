'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight, oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Loader2, Sparkles, Copy, Trash2, Wand2, UploadCloud, FileCode } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { handleRegexGeneration } from '@/app/actions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface RegexResult {
  regex: string;
  explanation: string;
}

const formSchema = z.object({
  sampleText: z.string().min(5, 'Please provide at least 5 characters of sample text.'),
  isCaseSensitive: z.boolean(),
  isGlobal: z.boolean(),
  isMultiline: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

const codeSnippets: Record<string, (regex: string) => string> = {
    javascript: (regex) => `const regex = ${regex};\nconst str = \`Your test string\`;\nconst matches = str.match(regex);\nconsole.log(matches);`,
    python: (regex) => {
        const pattern = regex.slice(1, regex.lastIndexOf('/'));
        const flags = regex.slice(regex.lastIndexOf('/') + 1);
        let pyFlags = '';
        if (flags.includes('i')) pyFlags += 're.IGNORECASE | ';
        if (flags.includes('m')) pyFlags += 're.MULTILINE | ';
        if (pyFlags.endsWith(' | ')) pyFlags = pyFlags.slice(0, -3);

        return `import re\n\nregex = r"${pattern}"\ntext = "Your test string"\n\nmatches = re.findall(regex, text${pyFlags ? ', ' + pyFlags : ''})\nprint(matches)`;
    },
    php: (regex) => `$regex = '${regex}';\n$str = 'Your test string';\npreg_match_all($regex, $str, $matches, PREG_SET_ORDER, 0);\n\nvar_dump($matches);`,
};


export function RegexGeneratorFromText() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<RegexResult | null>(null);
  const [testString, setTestString] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sampleText: '',
      isCaseSensitive: false,
      isGlobal: true,
      isMultiline: false,
    },
    mode: 'onChange',
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'Copied to clipboard!' });
  };
  
  const clearAll = () => {
    form.reset();
    setResult(null);
    setTestString('');
  }

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    setResult(null);

    try {
      const response = await handleRegexGeneration(data);
      if (response.error) {
        throw new Error(response.error);
      }
      setResult(response.data as RegexResult);
      toast({
        title: 'Regex Generated!',
        description: 'Your AI-powered regular expression is ready.',
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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result as string;
            form.setValue('sampleText', text);
        };
        reader.readAsText(file);
    }
  };
  
  const getHighlightedText = () => {
    if (!result || !testString) {
      return <p className="text-muted-foreground">Enter a test string to see matches.</p>;
    }
    try {
      const flags = `${form.getValues('isGlobal') ? 'g' : ''}${form.getValues('isCaseSensitive') ? '' : 'i'}${form.getValues('isMultiline') ? 'm' : ''}`;
      const pattern = new RegExp(result.regex.slice(1, result.regex.lastIndexOf('/')), flags);
      const parts = testString.split(pattern);
      const matches = testString.match(pattern);

      if (!matches) {
        return <span>{testString}</span>;
      }

      return (
        <p className="whitespace-pre-wrap">
          {parts.map((part, i) => (
            <span key={i}>
              {part}
              {i < matches.length && (
                <mark className="bg-primary/20 text-primary font-medium rounded-sm px-1">
                  {matches[i]}
                </mark>
              )}
            </span>
          ))}
        </p>
      );
    } catch (e) {
      return <p className="text-destructive">Invalid regular expression.</p>;
    }
  };


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                    <span>Input</span>
                    <Button type="button" variant="ghost" size="sm" onClick={clearAll}><Trash2 className="mr-2 h-4 w-4"/>Clear All</Button>
                </CardTitle>
                <CardDescription>
                  Provide sample text and the AI will generate a regex to match the pattern.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="paste">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="paste">Paste Text</TabsTrigger>
                        <TabsTrigger value="upload">Upload File</TabsTrigger>
                    </TabsList>
                    <TabsContent value="paste" className="mt-4">
                        <FormField
                            control={form.control}
                            name="sampleText"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Sample Text</FormLabel>
                                <FormControl>
                                    <Textarea
                                    placeholder={`Paste your text here...\ne.g., "My email is test@example.com"`}
                                    rows={8}
                                    className="font-mono text-sm"
                                    {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </TabsContent>
                    <TabsContent value="upload" className="mt-4">
                        <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-background transition-colors">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                                <UploadCloud className="w-10 h-10 mb-3 text-muted-foreground" />
                                <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                <p className="text-xs text-muted-foreground">.TXT file</p>
                            </div>
                             <Input id="file-upload" type="file" className="hidden" accept=".txt" onChange={handleFileChange} />
                        </label>
                    </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

             <Card>
                <CardHeader>
                    <CardTitle>Pattern Options</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-x-4 gap-y-2">
                        <FormField
                            control={form.control}
                            name="isCaseSensitive"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                                <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                <FormLabel className="font-normal">Case Sensitive</FormLabel>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="isGlobal"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                                <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                <FormLabel className="font-normal">Global Match</FormLabel>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="isMultiline"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                                <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                <FormLabel className="font-normal">Multi-line</FormLabel>
                                </FormItem>
                            )}
                        />
                    </div>
                </CardContent>
             </Card>

            <Button
              type="submit"
              className="w-full h-12 text-lg"
              disabled={isLoading || !form.formState.isValid}
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-5 w-5" />
              )}
              Generate Regex
            </Button>
          </div>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Output</CardTitle>
                <CardDescription>
                  The generated regular expression and an explanation of how it works.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center text-center p-8 h-64">
                    <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
                    <h3 className="text-xl font-semibold">Generating Regex...</h3>
                    <p className="text-muted-foreground">The AI is analyzing your text.</p>
                  </div>
                ) : result ? (
                  <Tabs defaultValue="explanation" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="explanation"><Wand2 className="mr-2"/>AI Explanation</TabsTrigger>
                        <TabsTrigger value="snippets"><FileCode className="mr-2"/>Code Snippets</TabsTrigger>
                    </TabsList>
                     <TabsContent value="explanation" className="mt-4 space-y-4">
                        <div>
                        <FormLabel>Generated Regex</FormLabel>
                        <div className="relative mt-1">
                            <div className="bg-muted rounded-md p-3 font-mono text-sm overflow-x-auto">
                                {result.regex}
                            </div>
                            <Button variant="ghost" size="icon" className="absolute top-1 right-1 h-8 w-8" onClick={() => copyToClipboard(result.regex)}><Copy/></Button>
                        </div>
                        </div>
                        <div>
                        <FormLabel>Explanation</FormLabel>
                        <div className="text-sm p-3 bg-muted rounded-md text-muted-foreground prose prose-sm dark:prose-invert max-w-none mt-1" dangerouslySetInnerHTML={{ __html: result.explanation.replace(/\n/g, '<br/>') }}></div>
                        </div>
                     </TabsContent>
                     <TabsContent value="snippets" className="mt-4 space-y-4">
                         <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select language" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="javascript">JavaScript</SelectItem>
                                <SelectItem value="python">Python</SelectItem>
                                <SelectItem value="php">PHP</SelectItem>
                            </SelectContent>
                         </Select>
                         <div className="relative">
                            <SyntaxHighlighter language={selectedLanguage} style={oneLight} className="!mt-1 !p-3 !rounded-md !bg-muted" showLineNumbers>
                                {codeSnippets[selectedLanguage](result.regex)}
                            </SyntaxHighlighter>
                            <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-8 w-8" onClick={() => copyToClipboard(codeSnippets[selectedLanguage](result.regex))}><Copy/></Button>
                         </div>
                     </TabsContent>
                  </Tabs>
                ) : (
                  <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg h-64 flex items-center justify-center">
                    <p>Your generated regex will appear here.</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
             <Card>
                <CardHeader><CardTitle>Live Tester</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-1">
                        <FormLabel htmlFor="test-string">Test String</FormLabel>
                        <Textarea 
                            id="test-string"
                            placeholder="Paste text here to test the regex against it."
                            value={testString}
                            onChange={(e) => setTestString(e.target.value)}
                            rows={4}
                            disabled={!result}
                        />
                    </div>
                    <div className="space-y-1">
                        <FormLabel>Matches</FormLabel>
                        <div className="p-3 bg-muted rounded-md min-h-[80px] text-sm">
                            {getHighlightedText()}
                        </div>
                    </div>
                </CardContent>
             </Card>

          </div>
        </div>
      </form>
    </Form>
  );
}
