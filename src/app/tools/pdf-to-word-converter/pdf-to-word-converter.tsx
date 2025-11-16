"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/use-language';
import { Loader2, FileUp, FileDown, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export function PdfToWordConverter() {
  const { toast } = useToast();
  const { translate } = useLanguage();
  const [file, setFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [convertedFile, setConvertedFile] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setConvertedFile(null);
    } else {
      toast({
        title: 'Invalid File Type',
        description: 'Please upload a PDF file.',
        variant: 'destructive',
      });
    }
  };

  const processConversion = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) {
      toast({
        title: 'No File Selected',
        description: 'Please upload a PDF file to convert.',
        variant: 'destructive',
      });
      return;
    }

    setIsConverting(true);

    // Placeholder function: simulate conversion
    await new Promise(resolve => setTimeout(resolve, 2000));

    // In a real implementation, you would call a server-side function
    // that processes the PDF and returns a URL to the Word document.
    const dummyWordFileUrl = '/placeholder-document.docx';
    setConvertedFile(dummyWordFileUrl);

    toast({
      title: 'Conversion Successful',
      description: `${file.name} has been converted to a Word document.`,
    });
    
    setIsConverting(false);
  };
  
  const downloadFile = () => {
    if(convertedFile) {
        const link = document.createElement('a');
        link.href = convertedFile;
        const fileName = file?.name.replace('.pdf', '.docx') || 'document.docx';
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
  };

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Upload your PDF file to instantly convert it into an editable Word document.
      </p>
      
      <Card>
        <CardContent className="p-6">
          <form onSubmit={processConversion} className="space-y-4">
            <div className="flex items-center justify-center w-full">
                <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-background">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <FileUp className="w-10 h-10 mb-3 text-muted-foreground" />
                        {file ? (
                          <p className="font-semibold text-primary">{file.name}</p>
                        ) : (
                          <>
                            <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                            <p className="text-xs text-muted-foreground">PDF only (MAX. 5MB)</p>
                          </>
                        )}
                    </div>
                    <Input id="dropzone-file" type="file" className="hidden" accept="application/pdf" onChange={handleFileChange} disabled={isConverting} />
                </label>
            </div> 
            <Button type="submit" className="w-full" disabled={isConverting || !file}>
              {isConverting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Converting...
                </>
              ) : (
                'Convert to Word'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {convertedFile && (
        <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                 <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Conversion Complete!</h3>
                <p className="text-muted-foreground mb-4">Your Word document is ready to be downloaded.</p>
                <Button onClick={downloadFile}>
                    <FileDown className="mr-2"/>
                    Download .DOCX File
                </Button>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
