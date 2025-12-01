
'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import {
  CheckCircle,
  FileJson,
  FileText,
  Loader2,
  TableIcon,
  Trash2,
  UploadCloud,
  XCircle,
  FileSpreadsheet,
  Copy,
  Settings,
  RefreshCw,
  ListTree,
  PenSquare,
  ChevronsRightLeft,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

type TableData = {
  headers: string[];
  rows: (string | number | boolean | null)[][];
};

type FlattenStyle = 'dot' | 'underscore';

const JsonTree = ({ data, level = 0 }: { data: any; level?: number }) => {
  if (typeof data !== 'object' || data === null) {
    return <span className="text-green-500">{JSON.stringify(data)}</span>;
  }

  return (
    <div className={`pl-4 ${level > 0 ? 'border-l border-muted' : ''}`}>
      {Object.entries(data).map(([key, value]) => (
        <div key={key}>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value={key} className="border-b-0">
              <AccordionTrigger className="py-1 hover:no-underline">
                <span className="font-mono text-sm text-primary">{key}:</span>
              </AccordionTrigger>
              <AccordionContent className="pb-0">
                <JsonTree data={value} level={level + 1} />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      ))}
    </div>
  );
};

export function JsonExcelConverter() {
  const [jsonInput, setJsonInput] = useState('');
  const [tableData, setTableData] = useState<TableData | null>(null);
  const [allKeys, setAllKeys] = useState<string[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [flattenStyle, setFlattenStyle] = useState<FlattenStyle>('dot');
  const { toast } = useToast();
  
  const [excelToJsonOutput, setExcelToJsonOutput] = useState('');
  const [activeTab, setActiveTab] = useState('json-to-excel');

  const handleJsonInputChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setJsonInput(e.target.value);
    if(activeTab === 'json-to-excel') {
      parseAndDisplayJson(e.target.value);
    }
  };
  
  const clearAll = () => {
    setJsonInput('');
    setTableData(null);
    setAllKeys([]);
    setSelectedKeys({});
    setError(null);
    setExcelToJsonOutput('');
    const fileInput = document.getElementById('file-upload-json') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
    const excelFileInput = document.getElementById('file-upload-excel') as HTMLInputElement;
    if (excelFileInput) excelFileInput.value = '';
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => {
        const text = e.target?.result as string;
        setJsonInput(text);
        if (activeTab === 'json-to-excel') {
          parseAndDisplayJson(text);
        }
      };
      reader.readAsText(file);
    }
  };
  
  const handleExcelFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet);
        setExcelToJsonOutput(JSON.stringify(json, null, 2));
        toast({ title: 'Excel file processed successfully!' });
      };
      reader.readAsBinaryString(file);
    }
  };

  const handleFetchUrl = async () => {
    const url = (document.getElementById('url-input') as HTMLInputElement)
      .value;
    if (!url) {
      toast({
        title: 'URL is empty',
        description: 'Please enter a URL to fetch JSON from.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      // Note: This fetch is subject to CORS policies of the destination server.
      // We can suggest a server-side proxy for a more robust solution.
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const jsonString = JSON.stringify(data, null, 2);
      setJsonInput(jsonString);
      if(activeTab === 'json-to-excel') {
        parseAndDisplayJson(jsonString);
      }
    } catch (e: any) {
      toast({
        title: 'Failed to fetch URL',
        description: e.message || 'Could not retrieve data. This may be due to browser CORS restrictions.',
        variant: 'destructive',
      });
      setError('Could not retrieve data from the URL. This may be due to browser CORS restrictions.');
    } finally {
      setIsLoading(false);
    }
  };

  const flattenObject = (obj: any, prefix = '', style: FlattenStyle = 'dot'): Record<string, any> => {
    const separator = style === 'dot' ? '.' : '_';
    return Object.keys(obj).reduce((acc, k) => {
        const pre = prefix.length ? prefix + separator : '';
        const key = pre + k;
        if (obj[k] && typeof obj[k] === 'object' && !Array.isArray(obj[k])) {
            Object.assign(acc, flattenObject(obj[k], key, style));
        } else {
            acc[key] = obj[k];
        }
        return acc;
    }, {} as Record<string, any>);
  };

  const flattenJson = (data: any, style: FlattenStyle): Record<string, any>[] => {
    let array = Array.isArray(data) ? data : [data];
    return array.map(item => flattenObject(item, '', style));
  };


  const parseAndDisplayJson = (jsonString: string) => {
    if (!jsonString.trim()) {
      setJsonInput('');
      setTableData(null);
      setAllKeys([]);
      setSelectedKeys({});
      setError(null);
      return;
    }

    try {
      const data = JSON.parse(jsonString);
      setError(null);

      const flattenedData = flattenJson(data, flattenStyle);
      if (flattenedData.length === 0) {
        setTableData(null);
        return;
      }
      
      const headers = Array.from(new Set(flattenedData.flatMap(Object.keys))).sort();
      setAllKeys(headers);
      
      const initialSelectedKeys: Record<string, boolean> = {};
      headers.forEach(h => initialSelectedKeys[h] = true);
      setSelectedKeys(initialSelectedKeys);

    } catch (e) {
      setError('Invalid JSON format. Please check your input.');
      setTableData(null);
      setAllKeys([]);
      setSelectedKeys({});
    }
  };
  
  React.useEffect(() => {
    if (jsonInput && activeTab === 'json-to-excel') {
        parseAndDisplayJson(jsonInput);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flattenStyle, activeTab]);
  
  const filteredTableData = useMemo((): TableData | null => {
    if (!jsonInput || error) return null;
    try {
        const data = JSON.parse(jsonInput);
        const flattenedData = flattenJson(data, flattenStyle);
        const activeKeys = allKeys.filter(k => selectedKeys[k]);
        
        const rows = flattenedData.map(item =>
            activeKeys.map(header => {
                const value = item[header];
                if (typeof value === 'object' && value !== null) {
                    return JSON.stringify(value);
                }
                return value === undefined ? null : value;
            })
        );

        return { headers: activeKeys, rows };
    } catch {
        return null;
    }
  }, [jsonInput, allKeys, selectedKeys, flattenStyle, error]);

  const handleDownload = (format: 'xlsx' | 'csv') => {
    if (!filteredTableData) {
      toast({
        title: 'No data to download',
        description: 'Please provide valid JSON first.',
        variant: 'destructive',
      });
      return;
    }

    const worksheetData = [
      filteredTableData.headers,
      ...filteredTableData.rows.map(row => row.map(cell => (cell === null ? '' : cell))),
    ];

    if (format === 'xlsx') {
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet(worksheetData);
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      XLSX.writeFile(wb, 'converted_data.xlsx');
    } else if (format === 'csv') {
      const csv = Papa.unparse(worksheetData);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.setAttribute('download', 'converted_data.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied to clipboard!" });
  };
  
  const beautifyJson = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setJsonInput(JSON.stringify(parsed, null, 2));
      setError(null);
    } catch (e) {
      setError("Cannot format invalid JSON.");
    }
  }
  
  const parsedJsonForTree = useMemo(() => {
    try {
        return JSON.parse(jsonInput);
    } catch {
        return null;
    }
  }, [jsonInput]);

  return (
    <div className="space-y-4">
        <Tabs defaultValue="json-to-excel" onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="json-to-excel"><ChevronsRightLeft className="mr-2"/>JSON to Excel/CSV</TabsTrigger>
                <TabsTrigger value="excel-to-json"><ChevronsRightLeft className="mr-2"/>Excel to JSON</TabsTrigger>
                <TabsTrigger value="tree-viewer"><ListTree className="mr-2"/>Tree Viewer</TabsTrigger>
                <TabsTrigger value="formatter"><PenSquare className="mr-2"/>Formatter</TabsTrigger>
            </TabsList>
            
            <TabsContent value="json-to-excel">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-6">
                       <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                            <div className="flex items-center gap-2"><FileJson /> JSON Input</div>
                             <Button variant="ghost" size="sm" onClick={clearAll}><Trash2 className="mr-2"/>Clear</Button>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Tabs defaultValue="paste">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="paste">Paste</TabsTrigger>
                                <TabsTrigger value="upload">Upload</TabsTrigger>
                                <TabsTrigger value="url">From URL</TabsTrigger>
                            </TabsList>
                            <TabsContent value="paste" className="mt-4">
                                <Textarea
                                placeholder='{ "message": "Paste your JSON here" }'
                                value={jsonInput}
                                onChange={handleJsonInputChange}
                                className="min-h-[200px] font-mono text-sm"
                                />
                            </TabsContent>
                            <TabsContent value="upload" className="mt-4">
                                <label
                                htmlFor="file-upload-json"
                                className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-background transition-colors"
                                >
                                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                                    <UploadCloud className="w-10 h-10 mb-3 text-muted-foreground" />
                                    <p className="mb-2 text-sm text-muted-foreground">
                                    <span className="font-semibold">Click to upload</span> or
                                    drag & drop
                                    </p>
                                    <p className="text-xs text-muted-foreground">.JSON or .TXT file</p>
                                </div>
                                <Input
                                    id="file-upload-json"
                                    type="file"
                                    className="hidden"
                                    accept=".json,.txt"
                                    onChange={handleFileChange}
                                />
                                </label>
                            </TabsContent>
                            <TabsContent value="url" className="mt-4 space-y-4">
                                <Label htmlFor="url-input">JSON URL</Label>
                                <div className="flex gap-2">
                                <Input
                                    id="url-input"
                                    type="url"
                                    placeholder="https://api.example.com/data.json"
                                />
                                <Button onClick={handleFetchUrl} disabled={isLoading}>
                                    {isLoading ? (
                                    <Loader2 className="animate-spin" />
                                    ) : (
                                    'Fetch'
                                    )}
                                </Button>
                                </div>
                            </TabsContent>
                            </Tabs>

                            {error && (
                            <Alert variant="destructive" className="mt-4">
                                <XCircle className="h-4 w-4" />
                                <AlertTitle>Validation Error</AlertTitle>
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                            )}
                            {!error && jsonInput && (
                            <Alert variant="default" className="mt-4 border-green-500/50">
                                <CheckCircle className="h-4 w-4 text-green-500"/>
                                <AlertTitle>JSON is Valid</AlertTitle>
                            </Alert>
                            )}
                        </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2"><Settings/> Options</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div>
                                    <Label>Flattening Style</Label>
                                    <RadioGroup value={flattenStyle} onValueChange={(v) => setFlattenStyle(v as FlattenStyle)} className="mt-2">
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="dot" id="r_dot" />
                                            <Label htmlFor="r_dot">Dot Notation (e.g. user.name)</Label>
                                        </div>
                                         <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="underscore" id="r_underscore" />
                                            <Label htmlFor="r_underscore">Underscore Notation (e.g. user_name)</Label>
                                        </div>
                                    </RadioGroup>
                                </div>
                                {allKeys.length > 0 && (
                                    <div>
                                        <Label>Select Columns ({Object.values(selectedKeys).filter(Boolean).length} / {allKeys.length})</Label>
                                        <ScrollArea className="h-40 w-full rounded-md border p-4 mt-2">
                                            <div className="space-y-2">
                                                {allKeys.map(key => (
                                                    <div key={key} className="flex items-center space-x-2">
                                                        <Checkbox
                                                            id={key}
                                                            checked={selectedKeys[key]}
                                                            onCheckedChange={(checked) => {
                                                                setSelectedKeys(prev => ({...prev, [key]: !!checked}))
                                                            }}
                                                        />
                                                        <label htmlFor={key} className="text-sm font-mono leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                            {key}
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                        </ScrollArea>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column */}
                    <div className="lg:col-span-3 space-y-4">
                        <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                            <TableIcon /> Table Preview
                            </CardTitle>
                            <CardDescription>
                            Your JSON data displayed as a table.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {filteredTableData ? (
                            <div className="overflow-auto border rounded-lg max-h-[500px]">
                                <Table>
                                <TableHeader className="sticky top-0 bg-muted z-10">
                                    <TableRow>
                                    {filteredTableData.headers.map(header => (
                                        <TableHead key={header}>{header}</TableHead>
                                    ))}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredTableData.rows.map((row, rowIndex) => (
                                    <TableRow key={rowIndex}>
                                        {row.map((cell, cellIndex) => (
                                        <TableCell key={cellIndex} className="whitespace-nowrap font-mono text-xs">
                                            {cell === null ? (
                                            <span className="text-muted-foreground">
                                                null
                                            </span>
                                            ) : (
                                            String(cell)
                                            )}
                                        </TableCell>
                                        ))}
                                    </TableRow>
                                    ))}
                                </TableBody>
                                </Table>
                            </div>
                            ) : (
                            <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg h-96 flex items-center justify-center">
                                <p>Provide valid JSON to see the table preview.</p>
                            </div>
                            )}
                            <div className="flex flex-wrap gap-2 mt-4">
                            <Button
                                onClick={() => handleDownload('xlsx')}
                                disabled={!filteredTableData}
                            >
                                <FileSpreadsheet className="mr-2" /> Download .xlsx
                            </Button>
                            <Button
                                onClick={() => handleDownload('csv')}
                                disabled={!filteredTableData}
                                variant="secondary"
                            >
                                <FileText className="mr-2" /> Download .csv
                            </Button>
                            <Button
                                onClick={() => copyToClipboard(Papa.unparse( [ filteredTableData?.headers ?? [], ...filteredTableData?.rows ?? []], { delimiter: "\t" }))}
                                disabled={!filteredTableData}
                                variant="outline"
                            >
                                <Copy className="mr-2"/> Copy Table
                            </Button>
                            </div>
                        </CardContent>
                        </Card>
                    </div>
                </div>
            </TabsContent>

            <TabsContent value="excel-to-json">
                 <Card>
                    <CardHeader>
                        <CardTitle>Excel/CSV to JSON Converter</CardTitle>
                        <CardDescription>Upload your spreadsheet to convert it into JSON format.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                         <label
                            htmlFor="file-upload-excel"
                            className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-background transition-colors"
                            >
                            <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                                <UploadCloud className="w-10 h-10 mb-3 text-muted-foreground" />
                                <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag & drop</p>
                                <p className="text-xs text-muted-foreground">.XLSX or .CSV file</p>
                            </div>
                            <Input id="file-upload-excel" type="file" className="hidden" accept=".xlsx,.csv" onChange={handleExcelFileChange} />
                        </label>
                        {excelToJsonOutput && (
                             <div className="relative">
                                <Textarea
                                    value={excelToJsonOutput}
                                    readOnly
                                    className="min-h-[300px] font-mono text-sm bg-muted"
                                />
                                <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => copyToClipboard(excelToJsonOutput)}><Copy/></Button>
                            </div>
                        )}
                    </CardContent>
                 </Card>
            </TabsContent>

            <TabsContent value="tree-viewer">
                 <Card>
                    <CardHeader>
                        <CardTitle>JSON Tree Viewer</CardTitle>
                        <CardDescription>Explore your JSON data in a collapsible tree structure.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Textarea
                            placeholder='{ "message": "Paste your JSON here to view it as a tree" }'
                            value={jsonInput}
                            onChange={handleJsonInputChange}
                            className="min-h-[150px] font-mono text-sm mb-4"
                        />
                         {parsedJsonForTree ? (
                             <ScrollArea className="h-96 w-full rounded-md border p-4">
                                <JsonTree data={parsedJsonForTree} />
                            </ScrollArea>
                         ) : (
                            <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg h-96 flex items-center justify-center">
                                <p>Provide valid JSON to see the tree view.</p>
                            </div>
                         )}
                    </CardContent>
                 </Card>
            </TabsContent>

            <TabsContent value="formatter">
                 <Card>
                    <CardHeader>
                        <CardTitle>JSON Formatter & Beautifier</CardTitle>
                        <CardDescription>Clean up and format your JSON to make it readable.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                         <Textarea
                            placeholder='{"messy":"json"}'
                            value={jsonInput}
                            onChange={handleJsonInputChange}
                            className="min-h-[400px] font-mono text-sm"
                        />
                        <Button onClick={beautifyJson}><RefreshCw className="mr-2"/>Beautify JSON</Button>
                         {error && (
                            <Alert variant="destructive" className="mt-4">
                                <XCircle className="h-4 w-4" />
                                <AlertTitle>Validation Error</AlertTitle>
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                    </CardContent>
                 </Card>
            </TabsContent>
        </Tabs>
    </div>
  );
}
