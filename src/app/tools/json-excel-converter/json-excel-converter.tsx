
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
  FileUp,
  Link,
  Loader2,
  TableIcon,
  Trash2,
  UploadCloud,
  XCircle,
  FileSpreadsheet,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';

type TableData = {
  headers: string[];
  rows: (string | number | boolean | null)[][];
};

export function JsonExcelConverter() {
  const [jsonInput, setJsonInput] = useState('');
  const [tableData, setTableData] = useState<TableData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleJsonInputChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setJsonInput(e.target.value);
    parseAndDisplayJson(e.target.value);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => {
        const text = e.target?.result as string;
        setJsonInput(text);
        parseAndDisplayJson(text);
      };
      reader.readAsText(file);
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
      // Note: This fetch is client-side and may be blocked by CORS.
      // A more robust solution would use a server-side proxy.
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const jsonString = JSON.stringify(data, null, 2);
      setJsonInput(jsonString);
      parseAndDisplayJson(jsonString);
    } catch (e: any) {
      toast({
        title: 'Failed to fetch URL',
        description: e.message || 'Could not retrieve data from the URL.',
        variant: 'destructive',
      });
      setError('Could not retrieve data from the URL.');
    } finally {
      setIsLoading(false);
    }
  };

  const parseAndDisplayJson = (jsonString: string) => {
    if (!jsonString.trim()) {
      setTableData(null);
      setError(null);
      return;
    }

    try {
      const data = JSON.parse(jsonString);
      setError(null);

      // Convert JSON to table structure
      const flattenedData = flattenJson(data);
      if (flattenedData.length === 0) {
        setTableData(null);
        return;
      }
      
      const headers = Array.from(new Set(flattenedData.flatMap(Object.keys)));
      const rows = flattenedData.map(item =>
        headers.map(header => {
            const value = item[header];
            if (typeof value === 'object' && value !== null) {
                return JSON.stringify(value);
            }
            return value === undefined ? null : value;
        })
      );

      setTableData({ headers, rows });
    } catch (e) {
      setError('Invalid JSON format. Please check your input.');
      setTableData(null);
    }
  };
  
  const flattenJson = (data: any): Record<string, any>[] => {
    let array = Array.isArray(data) ? data : [data];
    
    const flattenObject = (obj: any, prefix = ''): Record<string, any> => {
        return Object.keys(obj).reduce((acc, k) => {
            const pre = prefix.length ? prefix + '.' : '';
            const key = pre + k;
            if (obj[k] && typeof obj[k] === 'object' && !Array.isArray(obj[k])) {
                Object.assign(acc, flattenObject(obj[k], key));
            } else {
                acc[key] = obj[k];
            }
            return acc;
        }, {} as Record<string, any>);
    };

    return array.map(item => flattenObject(item));
  };


  const handleDownload = (format: 'xlsx' | 'csv') => {
    if (!tableData) {
      toast({
        title: 'No data to download',
        description: 'Please provide valid JSON first.',
        variant: 'destructive',
      });
      return;
    }

    const worksheetData = [
      tableData.headers,
      ...tableData.rows.map(row => row.map(cell => (cell === null ? '' : cell))),
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileJson /> Input
            </CardTitle>
            <CardDescription>
              Paste, upload, or fetch JSON from a URL.
            </CardDescription>
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
                  htmlFor="file-upload"
                  className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-background transition-colors"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                    <UploadCloud className="w-10 h-10 mb-3 text-muted-foreground" />
                    <p className="mb-2 text-sm text-muted-foreground">
                      <span className="font-semibold">Click to upload</span> or
                      drag & drop
                    </p>
                    <p className="text-xs text-muted-foreground">.JSON file</p>
                  </div>
                  <Input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    accept=".json"
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
                <AlertDescription>
                  Your JSON has been parsed successfully.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
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
            {tableData ? (
              <div className="overflow-x-auto border rounded-lg max-h-96">
                <Table>
                  <TableHeader className="sticky top-0 bg-muted">
                    <TableRow>
                      {tableData.headers.map(header => (
                        <TableHead key={header}>{header}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tableData.rows.map((row, rowIndex) => (
                      <TableRow key={rowIndex}>
                        {row.map((cell, cellIndex) => (
                          <TableCell key={cellIndex}>
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
            <div className="flex gap-2 mt-4">
              <Button
                onClick={() => handleDownload('xlsx')}
                disabled={!tableData}
              >
                <FileSpreadsheet className="mr-2" /> Download .xlsx
              </Button>
              <Button
                onClick={() => handleDownload('csv')}
                disabled={!tableData}
                variant="secondary"
              >
                <FileText className="mr-2" /> Download .csv
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
