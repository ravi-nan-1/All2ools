"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Zap, Settings, LineChart, History, AlertTriangle, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ForexAnalysisChart } from '@/components/tool-page/tools/forex-analysis-chart';

const mockBrokers = ['OANDA', 'FXCM', 'Interactive Brokers', 'Dukascopy', 'Pepperstone', 'IC Markets'];
const mockPairs = ['EUR/USD', 'USD/JPY', 'GBP/USD', 'USD/CHF', 'AUD/USD', 'USD/CAD'];

const mockOpportunities = [
  { path: 'EUR → USD → JPY → EUR', profit: '0.12%', age: '2s ago', brokers: ['OANDA', 'FXCM', 'Dukascopy'] },
  { path: 'GBP → USD → CHF → GBP', profit: '0.08%', age: '5s ago', brokers: ['Pepperstone', 'FXCM', 'Interactive Brokers'] },
  { path: 'USD → JPY → AUD → USD', profit: '0.05%', age: '12s ago', brokers: ['IC Markets', 'OANDA', 'FXCM'] },
];

const mockHistoricalOpportunities = [
    { id: 1, path: 'EUR → USD → CAD → EUR', profit: '0.09%', age: '2m 15s ago', brokers: ['OANDA', 'Dukascopy'] },
    { id: 2, path: 'GBP → JPY → USD → GBP', profit: '0.11%', age: '5m 45s ago', brokers: ['FXCM', 'Pepperstone'] },
    { id: 3, path: 'AUD → CHF → USD → AUD', profit: '0.07%', age: '10m 2s ago', brokers: ['IC Markets', 'Interactive Brokers'] },
    { id: 4, path: 'USD → CAD → JPY → USD', profit: '0.15%', age: '18m 30s ago', brokers: ['OANDA', 'FXCM'] },
  ];

const mockPriceFeeds = [
  { pair: 'EUR/USD', oanda: '1.0712', fxcm: '1.0713', ib: '1.0711' },
  { pair: 'USD/JPY', oanda: '157.45', fxcm: '157.44', ib: '157.46' },
  { pair: 'GBP/USD', oanda: '1.2543', fxcm: '1.2542', ib: '1.2544' },
];

export function ForexArbitrageChecker() {
    const [isScanning, setIsScanning] = useState(false);
    const [selectedBroker, setSelectedBroker] = useState<string>('');
    const [selectedPair, setSelectedPair] = useState<string>('');
    const [arbitrageType, setArbitrageType] = useState<string>('triangular');

    const handleScan = () => {
        setIsScanning(true);
        setTimeout(() => setIsScanning(false), 2000);
    }
    
    return (
        <div className="space-y-8">
            <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Disclaimer: For Educational & Illustrative Use Only</AlertTitle>
                <AlertDescription>
                    This is a conceptual UI demonstration. The data is randomly generated and not live. Forex arbitrage is extremely high-risk and requires professional-grade tools, strategies, and capital.
                </AlertDescription>
            </Alert>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Settings />
                        Control Panel
                    </CardTitle>
                    <CardDescription>Configure your arbitrage scan settings.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <Select value={selectedBroker} onValueChange={setSelectedBroker}>
                        <SelectTrigger><SelectValue placeholder="Select a Broker..." /></SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                            {mockBrokers.map(broker => (
                                <SelectItem key={broker} value={broker}>{broker}</SelectItem>
                            ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                     <Select value={selectedPair} onValueChange={setSelectedPair}>
                        <SelectTrigger><SelectValue placeholder="Select a Currency Pair..." /></SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                             {mockPairs.map(pair => (
                                <SelectItem key={pair} value={pair}>{pair}</SelectItem>
                            ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <Select value={arbitrageType} onValueChange={setArbitrageType}>
                        <SelectTrigger><SelectValue placeholder="Arbitrage Type..." /></SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                            <SelectItem value="triangular">Triangular</SelectItem>
                            <SelectItem value="direct">Direct (2-Leg)</SelectItem>
                             <SelectItem value="statistical" disabled>Statistical (soon)</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <Button onClick={handleScan} disabled={isScanning || !selectedBroker || !selectedPair}>
                        {isScanning ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Scanning...</>
                        ) : (
                            <><RefreshCw className="mr-2 h-4 w-4" />Scan for Opportunities</>
                        )}
                    </Button>
                </CardContent>
            </Card>

            <Tabs defaultValue="opportunities">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="opportunities"><Zap className="mr-2"/>Live Opportunities</TabsTrigger>
                    <TabsTrigger value="analysis"><LineChart className="mr-2"/>Analysis Charts</TabsTrigger>
                    <TabsTrigger value="history"><History className="mr-2"/>Historical Data</TabsTrigger>
                </TabsList>
                <TabsContent value="opportunities" className="mt-6">
                    <Card>
                         <CardHeader>
                            <CardTitle>Arbitrage Opportunities</CardTitle>
                            <CardDescription>Potential profit opportunities detected in the last scan. Execution speed and fees will impact actual returns.</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Arbitrage Path</TableHead>
                                        <TableHead>Brokers</TableHead>
                                        <TableHead className="text-right">Est. Profit</TableHead>
                                        <TableHead className="text-right">Detected</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {isScanning ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center py-12">
                                                <div className="flex justify-center items-center gap-2 text-muted-foreground">
                                                    <Loader2 className="h-6 w-6 animate-spin text-primary"/>
                                                    <span>Scanning multiple broker feeds...</span>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : mockOpportunities.map((opp) => (
                                        <TableRow key={opp.path}>
                                            <TableCell className="font-mono">{opp.path}</TableCell>
                                             <TableCell>
                                                <div className="flex flex-wrap gap-1">
                                                    {opp.brokers.map(b => <Badge key={b} variant="secondary">{b}</Badge>)}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right font-medium text-green-600">{opp.profit}</TableCell>
                                            <TableCell className="text-right text-muted-foreground">{opp.age}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
                 <TabsContent value="analysis" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Price Analysis Chart</CardTitle>
                      <CardDescription>
                        Visualizing mock historical price data for EUR/USD.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ForexAnalysisChart />
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="history" className="mt-6">
                   <Card>
                    <CardHeader>
                      <CardTitle>Historical Arbitrage Log</CardTitle>
                      <CardDescription>
                        A log of mock arbitrage opportunities detected in the past.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Arbitrage Path</TableHead>
                            <TableHead>Brokers</TableHead>
                            <TableHead className="text-right">Est. Profit</TableHead>
                            <TableHead className="text-right">Detected</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {mockHistoricalOpportunities.map((opp) => (
                            <TableRow key={opp.id}>
                              <TableCell className="font-mono">{opp.path}</TableCell>
                              <TableCell>
                                <div className="flex flex-wrap gap-1">
                                  {opp.brokers.map(b => <Badge key={b} variant="secondary">{b}</Badge>)}
                                </div>
                              </TableCell>
                              <TableCell className="text-right font-medium text-green-600">{opp.profit}</TableCell>
                              <TableCell className="text-right text-muted-foreground">{opp.age}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>
            </Tabs>
            
             <Card>
                <CardHeader>
                    <CardTitle>Live Price Feeds (Mock Data)</CardTitle>
                    <CardDescription>Simulated real-time bid/ask prices from different brokers.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Pair</TableHead>
                                <TableHead className="text-center">OANDA</TableHead>
                                <TableHead className="text-center">FXCM</TableHead>
                                <TableHead className="text-center">Interactive Brokers</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockPriceFeeds.map(feed => (
                                 <TableRow key={feed.pair}>
                                    <TableCell className="font-medium">{feed.pair}</TableCell>
                                    <TableCell className="text-center font-mono">{feed.oanda}</TableCell>
                                    <TableCell className="text-center font-mono">{feed.fxcm}</TableCell>
                                    <TableCell className="text-center font-mono">{feed.ib}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

        </div>
    );
}
