import type { LucideIcon } from 'lucide-react';
import {
  Calculator,
  Landmark,
  Globe,
  Bitcoin,
  Currency,
  FileText,
  Building2,
  Image,
  UserCircle,
  Scan,
  Smile,
  ShieldCheck,
  AppWindow,
  Binary,
  GitBranch,
  FileCode,
  ShoppingBag,
  Network,
  KeyRound,
  Regex,
  FileJson,
  Webhook,
  HeartPulse,
  BedDouble,
  Target,
  BadgeDollarSign,
  TrendingDown,
  Briefcase,
  FileSearch,
  Table,
} from 'lucide-react';

export type ToolCategory =
  | 'Finance'
  | 'Business'
  | 'Image'
  | 'SEO'
  | 'Developer'
  | 'Health';

export interface Tool {
  name: string;
  slug: string;
  category: ToolCategory;
  description: string;
  longDescription: string;
  icon: string;
  features: string[];
  howItWorks: string[];
  useCases: string[];
}

export const tools: Tool[] = [
  {
    name: 'AI Tax Deduction Finder',
    slug: 'ai-tax-deduction-finder',
    category: 'Finance',
    icon: 'Calculator',
    description:
      'Analyze income & expenses to detect legal tax deductions worldwide.',
    longDescription:
      'Our AI Tax Deduction Finder is a powerful, intelligent assistant designed to help individuals, freelancers, and small businesses maximize their annual tax savings. By analyzing your income, expenses, and relevant financial categories, the tool identifies potential legal tax deductions you might have missed. It leverages a vast knowledge base of international tax regulations to provide region-specific advice, ensuring your deductions are compliant and optimized for your location. Simply input your financial data, and optionally upload receipts for a more granular analysis. The AI then generates a comprehensive report detailing estimated tax savings, a list of applicable deductions, the documents you\'ll need for filing, and personalized tips to improve your financial habits for future tax seasons. Stop leaving money on the table and let our AI do the heavy lifting for you.',
    features: [
      'Analyzes income, expenses, and category tags.',
      'Optional receipt upload for detailed analysis.',
      'Estimates potential tax savings in your local currency.',
      'Generates a detailed list of applicable deductions.',
      'Provides actionable tips for financial optimization.',
      'Supports global tax regulations for accurate advice.',
    ],
    howItWorks: [
      'Enter your annual income and total expenses in the provided fields.',
      'Add relevant category tags like "home office", "business travel", or "software subscriptions".',
      'Optionally, upload digital receipts for a more in-depth analysis (feature coming soon).',
      'Click the "Analyze Deductions" button to let the AI process your information.',
      'Review the output panel for your estimated savings, a list of deductions, required documents, and personalized tips.',
    ],
    useCases: [
      'Freelancers tracking and maximizing their business-related write-offs.',
      'Small business owners preparing for annual tax filing.',
      'Individuals with side hustles looking to reduce their tax burden.',
      'Expatriates navigating the tax rules of a new country.',
    ],
  },
  {
    name: 'Startup Equity Calculator',
    slug: 'startup-equity-calculator',
    category: 'Finance',
    icon: 'Landmark',
    description:
      'Calculates founder equity, dilution over multiple funding rounds, ESOP distribution, and vesting schedules.',
    longDescription:
      'The Startup Equity Calculator is an essential tool for founders and startup teams. It helps you model and understand equity distribution, dilution, and ownership over time. Plan for multiple funding rounds, create and manage an Employee Stock Option Pool (ESOP), and visualize how vesting schedules will impact ownership. By providing a clear picture of equity scenarios, this calculator empowers founders to make informed decisions and plan for long-term success and ownership control.',
    features: [
      'Model multiple funding rounds (Seed, Series A, B, etc.)',
      'Calculate equity dilution for existing shareholders',
      'Plan and manage Employee Stock Option Pools (ESOP)',
      'Simulate vesting schedules and their impact',
    ],
    howItWorks: [
      'Enter initial founder equity distribution.',
      'Add new investment rounds with valuation and investment amounts.',
      'Define your ESOP and vesting rules.',
      'View a detailed cap table showing ownership percentages and dilution.',
    ],
    useCases: [
      'Founders planning their initial equity split.',
      'Startups preparing for a new funding round.',
      'Advisors helping companies model their capitalization table.',
    ],
  },
  {
    name: 'Global Loan Optimizer',
    slug: 'global-loan-optimizer',
    category: 'Finance',
    icon: 'Globe',
    description:
      'Compares loans across global banks using credit score, income, interest rates, EMI, and tenure.',
    longDescription:
      'The Global Loan Optimizer is your go-to platform for finding the best loan options worldwide. Whether you are looking for a personal loan, mortgage, or business financing, our tool simplifies the comparison process. By inputting your credit score, income, desired loan amount, and tenure, the optimizer scans offers from a vast network of global banks. It provides a clear comparison of interest rates, Equated Monthly Installments (EMI), and calculates the likelihood of approval, helping you secure the most favorable loan terms.',
    features: [
      'Compares loan offers from a global database of banks',
      'Calculates EMI, total interest, and total cost',
      'Estimates loan approval likelihood',
      'Filters by loan type (personal, mortgage, etc.)',
    ],
    howItWorks: [
      'Enter your financial profile (credit score, income).',
      'Specify your desired loan amount and tenure.',
      'The tool fetches and displays a list of matching loan offers.',
      'Compare options side-by-side and connect with lenders.',
    ],
    useCases: [
      'Individuals searching for the best personal loan rates.',
      'Homebuyers comparing mortgage options from different banks.',
      'Businesses seeking financing with favorable terms.',
    ],
  },
  {
    name: 'Crypto Tax Calculator',
    slug: 'crypto-tax-calculator',
    category: 'Finance',
    icon: 'Bitcoin',
    description:
      'Automatically computes crypto profit/loss, capital gains, staking income, and taxable events across chains.',
    longDescription:
      "Navigating crypto taxes can be complex. Our Crypto Tax Calculator simplifies the process by automatically tracking and computing your taxable events across multiple exchanges and blockchain networks. Connect your wallets and exchange accounts, and the tool will calculate your capital gains and losses, staking rewards, and other forms of income. It generates detailed reports that are compliant with tax regulations in various jurisdictions, making it easy to file your crypto taxes accurately and without the headache.",
    features: [
      'Integrates with major crypto exchanges and wallets',
      'Calculates capital gains and losses (FIFO, LIFO)',
      'Tracks staking rewards and other income',
      'Generates tax-ready reports for multiple countries',
    ],
    howItWorks: [
      'Connect your crypto exchange APIs and public wallet addresses.',
      'The tool automatically imports and categorizes your transactions.',
      'Review your transaction history and dashboard.',
      'Download your comprehensive tax report.',
    ],
    useCases: [
      'Crypto traders needing to calculate capital gains for tax season.',
      'Long-term investors tracking their portfolio performance.',
      'DeFi users who need to account for staking and yield farming income.',
    ],
  },
  {
    name: 'Forex Arbitrage Checker',
    slug: 'forex-arbitrage-checker',
    category: 'Finance',
    icon: 'Currency',
    description:
      'Scans global currency rates to find profitable conversion paths using real-time forex feeds.',
    longDescription:
      'Unlock hidden profits in the foreign exchange market with the Forex Arbitrage Checker. This tool continuously scans real-time currency rates from multiple global feeds to identify arbitrage opportunities. It highlights profitable multi-currency conversion paths, showing you the potential profit after accounting for transaction fees. Whether you are a seasoned forex trader or an enthusiast, this tool provides the insights needed to capitalize on market inefficiencies and execute profitable trades.',
    features: [
      'Scans real-time forex rates from multiple sources',
      'Identifies triangular and complex arbitrage opportunities',
      'Calculates potential profit after estimated fees',
      'Customizable alerts for new opportunities',
    ],
    howItWorks: [
      'The tool continuously monitors live forex data.',
      'It identifies discrepancies in currency pair rates across different markets.',
      'Profitable conversion paths are calculated and displayed.',
      'Users can review the opportunity and execute trades on their own platforms.',
    ],
    useCases: [
      'Forex traders looking for low-risk profit opportunities.',
      'Financial analysts monitoring currency market inefficiencies.',
      'Anyone interested in currency exchange dynamics.',
    ],
  },
  {
    name: 'AI Invoice Generator',
    slug: 'ai-invoice-generator',
    category: 'Business',
    icon: 'FileText',
    description:
      'Creates clean, branded invoices from simple inputs. Export to PDF, PNG, or email directly.',
    longDescription:
      "Streamline your billing process with the AI Invoice Generator. This tool allows you to create professional, branded invoices in minutes. Simply enter the client details, line items, and payment terms, and our AI will generate a clean, modern invoice. You can customize the template with your logo and brand colors. Once ready, export the invoice as a PDF or PNG, or email it directly to your client from the platform. It's the perfect solution for freelancers, consultants, and small businesses.",
    features: [
      'Customizable invoice templates',
      'Add your own logo and brand colors',
      'Export to PDF and PNG formats',
      'Email invoices directly to clients',
      'Track invoice status (sent, paid, overdue)',
    ],
    howItWorks: [
      'Choose a template and customize it with your brand.',
      'Fill in the invoice details: client, items, rates, and taxes.',
      'The AI generates a preview of the invoice.',
      'Save, download, or send the invoice to your client.',
    ],
    useCases: [
      'Freelancers billing for their services.',
      'Small businesses managing client invoices.',
      'Consultants creating professional payment requests.',
    ],
  },
  {
    name: 'Business Valuation Calculator',
    slug: 'business-valuation-calculator',
    category: 'Business',
    icon: 'Building2',
    description:
      'Uses DCF models, comparables, and market benchmarks to estimate accurate company valuation.',
    longDescription:
      'Determine the worth of your business with our comprehensive Business Valuation Calculator. This tool employs industry-standard methodologies, including Discounted Cash Flow (DCF) analysis, market comparables, and asset-based valuations. By inputting your company\'s financial data and industry benchmarks, you can generate a reliable estimation of its current market value. This is crucial for fundraising, mergers and acquisitions, or strategic planning.',
    features: [
      'Discounted Cash Flow (DCF) analysis',
      'Comparable Company Analysis (CCA)',
      'Asset-based valuation models',
      'Generates a detailed valuation report',
    ],
    howItWorks: [
      'Enter your business\'s historical and projected financial data.',
      'Provide details about your industry and market.',
      'The calculator processes the data using multiple valuation methods.',
      'Receive a valuation range and a detailed report explaining the results.',
    ],
    useCases: [
      'Startups seeking investment and needing a valuation.',
      'Business owners planning to sell their company.',
      'Investors assessing the value of a potential acquisition.',
    ],
  },
  {
    name: 'AI Product Background Remover',
    slug: 'ai-product-background-remover',
    category: 'Image',
    icon: 'Image',
    description:
      'Removes background from product photos and generates e-commerce-ready backgrounds.',
    longDescription:
      'Create stunning, professional product photos for your e-commerce store in seconds. The AI Product Background Remover automatically detects the subject in your image and cleanly removes the background. You can then replace it with a clean white background, a transparent one, or choose from a library of e-commerce-ready scenes. This tool is perfect for creating consistent, high-quality product listings for platforms like Amazon, Shopify, and Etsy.',
    features: [
      'Automatically removes image backgrounds',
      'Generates transparent PNGs',
      'Provides options for solid color or lifestyle backgrounds',
      'Batch processing for multiple images',
    ],
    howItWorks: [
      'Upload your product photograph.',
      'The AI automatically identifies the subject and removes the background.',
      'Choose your desired new background (transparent, white, etc.).',
      'Download your new e-commerce-ready image.',
    ],
    useCases: [
      'E-commerce sellers creating product listings.',
      'Marketers designing promotional materials.',
      'Photographers who need to quickly edit product shots.',
    ],
  },
  {
    name: 'AI Headshot Generator',
    slug: 'ai-headshot-generator',
    category: 'Image',
    icon: 'UserCircle',
    description:
      'Creates professional headshots from selfies using photography-grade AI enhancement.',
    longDescription:
      'Need a professional headshot but don\'t have the time or budget for a photographer? The AI Headshot Generator transforms your casual selfies into high-quality, professional headshots. Upload a few of your photos, and our AI will generate a variety of headshots with different outfits, backgrounds, and lighting conditions. It uses advanced enhancement techniques to ensure a photorealistic result, perfect for your LinkedIn profile, company website, or resume.',
    features: [
      'Generates multiple headshot styles from your photos',
      'Variety of professional outfits and backgrounds',
      'Photography-grade lighting and retouching',
      'High-resolution output',
    ],
    howItWorks: [
      'Upload 5-10 of your best selfies.',
      'Our AI trains on your likeness to create a personal model.',
      'Choose from a variety of generated headshot packs.',
      'Download your favorite high-quality headshots.',
    ],
    useCases: [
      'Professionals needing a new LinkedIn profile picture.',
      'Job seekers wanting a polished look for their applications.',
      'Teams looking for consistent headshots for their company website.',
    ],
  },
  {
    name: 'AI Transparent Logo Maker',
    slug: 'ai-transparent-logo-maker',
    category: 'Image',
    icon: 'Scan',
    description:
      'Removes white backgrounds, vectorizes logos, and exports transparent PNG/SVG.',
    longDescription:
      'Give your logo the flexibility it needs with the AI Transparent Logo Maker. This tool is designed to take any logo with a solid background (like white or black) and make it transparent. It intelligently removes the background while preserving the fine details of your design. Additionally, it can vectorize your logo, converting it into a scalable SVG format that looks sharp at any size. Export your new logo as a transparent PNG or SVG for use on websites, presentations, and merchandise.',
    features: [
      'Removes solid color backgrounds from logos',
      'Preserves edges and fine details',
      'Converts raster logos (JPG, PNG) to vector (SVG)',
      'Exports high-resolution transparent PNG and SVG files',
    ],
    howItWorks: [
      'Upload your logo image file.',
      'The AI processes the image to remove the background.',
      'Optionally, choose to vectorize the logo.',
      'Download the transparent PNG or SVG file.',
    ],
    useCases: [
      'Designers preparing logos for different media.',
      'Marketers needing a transparent logo for a website banner.',
      'Businesses who have lost the original vector file of their logo.',
    ],
  },
  {
    name: 'AI Meme Generator',
    slug: 'ai-meme-generator',
    category: 'Image',
    icon: 'Smile',
    description:
      'Generates meme templates, captions, and AI humor content instantly.',
    longDescription:
      "Go viral with the AI Meme Generator. This fun tool helps you create hilarious memes in seconds. Browse a vast library of popular and trending meme templates, or upload your own image. Our AI can even suggest witty captions based on the context of the image and current trends. It's the fastest way to generate engaging, humorous content for your social media channels, group chats, or marketing campaigns.",
    features: [
      'Large library of popular meme templates',
      'AI-powered caption suggestions',
      'Customize text, font, and color',
      'Upload your own images to create new memes',
    ],
    howItWorks: [
      'Select a popular meme template or upload an image.',
      'Use the AI to generate caption ideas or write your own.',
      'Customize the text placement and style.',
      'Download and share your newly created meme.',
    ],
    useCases: [
      'Social media managers creating engaging content.',
      'Individuals wanting to make funny memes for friends.',
      'Marketers looking to add humor to their campaigns.',
    ],
  },
  {
    name: 'AI Image Copyright Checker',
    slug: 'ai-image-copyright-checker',
    category: 'Image',
    icon: 'ShieldCheck',
    description:
      'Searches internet duplicates and sources to verify the originality of an image.',
    longDescription:
      'Protect yourself from copyright infringement with the AI Image Copyright Checker. Before you use an image, upload it to our tool to perform a reverse image search across the internet. Our AI scans for duplicates, identifies the original source, and provides information on its potential copyright status and usage rights. This is an essential tool for content creators, marketers, and businesses to ensure they are using images legally and ethically.',
    features: [
      'Performs a comprehensive reverse image search',
      'Identifies duplicate images across the web',
      'Helps find the original source and creator',
      'Provides guidance on potential usage rights',
    ],
    howItWorks: [
      'Upload the image you want to check.',
      'The AI scans its index and the web for matches.',
      'Review a report of where the image appears online.',
      'Use the information to assess its copyright status.',
    ],
    useCases: [
      'Bloggers verifying images before publishing an article.',
      'Designers checking for the source of stock photos.',
      'Businesses ensuring their marketing materials are copyright compliant.',
    ],
  },
  {
    name: 'Keyword Cluster Generator',
    slug: 'keyword-cluster-generator',
    category: 'SEO',
    icon: 'AppWindow',
    description:
      'Creates SEO keyword clusters using SERP intent, difficulty, and semantic grouping.',
    longDescription:
      'Elevate your SEO strategy with the Keyword Cluster Generator. Instead of targeting individual keywords, this tool helps you target topics. Input a seed keyword, and our AI will analyze the Search Engine Results Pages (SERPs) to find related keywords, questions, and entities. It then groups them into semantically related clusters based on user intent. This approach helps you create comprehensive content that ranks for a wide range of relevant queries, establishing topical authority.',
    features: [
      'Generates keyword ideas from a seed keyword',
      'Groups keywords into semantic clusters',
      'Analyzes SERP intent (informational, transactional, etc.)',
      'Provides keyword metrics like search volume and difficulty',
    ],
    howItWorks: [
      'Enter a primary keyword or topic.',
      'The tool scrapes SERP data and analyzes top-ranking pages.',
      'It identifies common subtopics and related keywords.',
      'Keywords are grouped into clusters, which you can export.',
    ],
    useCases: [
      'SEO specialists planning a content strategy.',
      'Content writers looking for subtopics to cover in an article.',
      'PPC managers building tightly themed ad groups.',
    ],
  },
  {
    name: 'AI Schema Markup Generator',
    slug: 'ai-schema-markup-generator',
    category: 'SEO',
    icon: 'Binary',
    description:
      'Generates JSON-LD Schema markup for businesses, articles, products, FAQs, and more.',
    longDescription:
      'Help search engines understand your content better and improve your visibility with rich snippets. The AI Schema Markup Generator creates valid JSON-LD schema for various content types. Simply choose a schema type (like Article, FAQ, Product, or Local Business), fill in a simple form with your details, and the tool will generate the correct markup. Copy and paste it into your website to enhance your SEO and stand out on the SERPs.',
    features: [
      'Supports a wide range of schema types',
      'User-friendly form-based input',
      'Generates error-free JSON-LD markup',
      'Includes a validator to test the schema',
    ],
    howItWorks: [
      'Select the type of schema you want to create.',
      'Fill out the form with your content details.',
      'The tool generates the JSON-LD script.',
      'Copy the script and add it to the <head> of your webpage.',
    ],
    useCases: [
      'Webmasters adding structured data to their site.',
      'SEO agencies improving client websites for rich snippets.',
      'E-commerce stores adding product schema to their listings.',
    ],
  },
  {
    name: 'Content Gap Analyzer',
    slug: 'content-gap-analyzer',
    category: 'SEO',
    icon: 'GitBranch',
    description:
      'Compares content against top competitors to find missing keywords and SERP intent issues.',
    longDescription:
      'Identify what your competitors are doing right and find opportunities to outperform them. The Content Gap Analyzer allows you to compare your content (or a target keyword) against the top-ranking pages on Google. It analyzes the competition to find common keywords, subtopics, and questions that they cover but you don\'t. By filling these "gaps," you can create more comprehensive and authoritative content that better matches user intent and has a higher chance of ranking.',
    features: [
      'Analyzes top-ranking pages for a given keyword',
      'Compares your content URL against competitors',
      'Identifies missing keywords and subtopics',
      'Provides actionable advice to improve content',
    ],
    howItWorks: [
      'Enter your target keyword and your content URL (optional).',
      'The tool analyzes the top 10 search results.',
      'It generates a report of keywords and topics covered by competitors.',
      'Use this report to update and improve your content.',
    ],
    useCases: [
      'Content marketers looking to improve existing articles.',
      'SEO strategists analyzing the competitive landscape.',
      'Writers planning a new piece of content to ensure it is comprehensive.',
    ],
  },
  {
    name: '1-Click Article Outline Generator',
    slug: '1-click-article-outline-generator',
    category: 'SEO',
    icon: 'FileCode',
    description:
      'Creates long-form article outlines with SEO headings, subtopics, and questions.',
    longDescription:
      'Beat writer\'s block and create SEO-optimized content faster than ever. The 1-Click Article Outline Generator takes your target keyword and generates a detailed, long-form article outline in seconds. The outline includes a logical structure of H2 and H3 headings, relevant subtopics to cover, and common questions people also ask. This tool is perfect for planning blog posts, articles, and guides that are structured for both readers and search engines.',
    features: [
      'Generates outlines based on a target keyword',
      'Includes SEO-friendly H2 and H3 headings',
      'Incorporates related questions and subtopics',
      'Creates a logical flow for long-form content',
    ],
    howItWorks: [
      'Enter the main topic or keyword for your article.',
      'Click the "Generate Outline" button.',
      'The AI analyzes SERPs and related topics to create a structure.',
      'Copy the outline and use it as a brief for your writer.',
    ],
    useCases: [
      'Bloggers planning their next article.',
      'Content teams creating writing briefs for freelancers.',
      'Anyone needing to structure their thoughts before writing.',
    ],
  },
  {
    name: 'AI Product Description Generator',
    slug: 'ai-product-description-generator',
    category: 'SEO',
    icon: 'ShoppingBag',
    description:
      'Generates optimized product descriptions for Amazon, Shopify, Etsy, and DTC stores.',
    longDescription:
      'Write compelling product descriptions that convert browsers into buyers. The AI Product Description Generator is trained to create persuasive, benefit-oriented, and SEO-friendly copy for your e-commerce products. Simply provide the product name and a few key features, and the AI will generate several description variants tailored for platforms like Amazon, Shopify, or your own direct-to-consumer (DTC) store. Save time and increase sales with professionally written descriptions.',
    features: [
      'Generates multiple description variants',
      'Optimized for different e-commerce platforms',
      'Allows you to set the tone of voice (e.g., professional, witty)',
      'Incorporates keywords for better SEO',
    ],
    howItWorks: [
      'Enter your product name and key features or attributes.',
      'Select the target platform and desired tone of voice.',
      'The AI generates a selection of product descriptions.',
      'Choose the best one and edit it to perfection.',
    ],
    useCases: [
      'E-commerce managers writing copy for new products.',
      'Amazon sellers looking to optimize their listings.',
      'Marketing agencies creating content for client stores.',
    ],
  },
  {
    name: 'API Latency Checker',
    slug: 'api-latency-checker',
    category: 'Developer',
    icon: 'Network',
    description:
      'Tests API endpoints from multiple regions worldwide to compare response quality.',
    longDescription:
      'Ensure your API provides a fast and reliable experience for all your users, no matter where they are. The API Latency Checker tests your API endpoints from various geographical regions around the world. It measures the response time, including DNS lookup, connection time, and time to first byte. The results are displayed on a map and in a table, allowing you to quickly identify performance bottlenecks and optimize your infrastructure for a global audience.',
    features: [
      'Tests API endpoints from multiple global locations',
      'Measures DNS, TCP connection, and TTFB',
      'Displays results on an interactive world map',
      'Tracks latency over time to monitor performance',
    ],
    howItWorks: [
      'Enter the URL of the API endpoint you want to test.',
      'Our distributed network of servers sends requests to your endpoint.',
      'The response times from each location are measured and recorded.',
      'View the detailed latency report for analysis.',
    ],
    useCases: [
      'Developers checking the performance of their new API.',
      'DevOps engineers monitoring global application health.',
      'Product managers evaluating the user experience in different markets.',
    ],
  },
  {
    name: 'JWT Decoder & Validator',
    slug: 'jwt-decoder-validator',
    category: 'Developer',
    icon: 'KeyRound',
    description:
      'Decodes JWT tokens, validates signatures, and checks expiry/claims.',
    longDescription:
      'A must-have tool for any developer working with JSON Web Tokens (JWT). Our JWT Decoder & Validator allows you to quickly paste a token to see its decoded header and payload. It also enables you to validate the token\'s signature against a secret or a public key (for RS256, etc.). The tool automatically checks for common issues like an expired signature and highlights the claims within the payload, making debugging and verification simple and efficient.',
    features: [
      'Decodes JWT header and payload',
      'Validates the token signature with a secret or key',
      'Checks for token expiration',
      'Pretty-prints JSON payload for readability',
    ],
    howItWorks: [
      'Paste your JWT into the input field.',
      'The header and payload are automatically decoded and displayed.',
      'To validate the signature, provide your algorithm and secret/key.',
      'The result of the validation is shown instantly.',
    ],
    useCases: [
      'Backend developers debugging authentication flows.',
      'Frontend developers inspecting the content of a JWT.',
      'Security engineers verifying token integrity.',
    ],
  },
  {
    name: 'Regex Generator From Text',
    slug: 'regex-generator-from-text',
    category: 'Developer',
    icon: 'Regex',
    description:
      'Converts natural language requests into working Regular Expressions with explanations.',
    longDescription:
      'Regular Expressions are powerful but notoriously tricky to write. With the Regex Generator From Text, you can simply describe the pattern you want to match in plain English, and our AI will convert your request into a working regular expression. The tool also provides a detailed explanation of how the generated regex works, helping you learn in the process. It supports various regex flavors and is perfect for developers, data analysts, and anyone tired of struggling with complex patterns.',
    features: [
      'Converts natural language to regular expressions',
      'Provides a detailed explanation of the regex',
      'Includes a testing tool to match against sample text',
      'Supports different regex flavors (JavaScript, Python, etc.)',
    ],
    howItWorks: [
      'Write a description of the text pattern you need to match.',
      'The AI generates a regex based on your description.',
      'Test the regex against your own input strings.',
      'Copy the regex and its explanation for your project.',
    ],
    useCases: [
      'Developers creating input validation rules.',
      'Data scientists extracting structured data from text.',
      'Students learning how to write regular expressions.',
    ],
  },
  {
    name: 'JSON → Excel Converter',
    slug: 'json-excel-converter',
    category: 'Developer',
    icon: 'FileJson',
    description:
      'Converts any JSON structure to downloadable Excel spreadsheets.',
    longDescription:
      'Quickly and easily convert your JSON data into a structured Excel file. Our JSON to Excel Converter can handle complex, nested JSON objects and arrays, intelligently flattening the data into a tabular format. Simply paste your JSON data or upload a file, and the tool will generate a preview of the resulting table. You can then download the data as an XLSX or CSV file, ready for analysis, reporting, or sharing with non-technical colleagues.',
    features: [
      'Handles nested JSON objects and arrays',
      'Intelligently flattens data into tabular format',
      'Supports pasting JSON or uploading a .json file',
      'Downloads as XLSX and CSV formats',
    ],
    howItWorks: [
      'Paste your JSON data into the text area or upload a file.',
      'The tool processes the data and generates a table preview.',
      'Choose your desired output format (Excel or CSV).',
      'Click download to get your converted file.',
    ],
    useCases: [
      'Developers needing to share API responses with business teams.',
      'Data analysts converting JSON data for use in Excel.',
      'Anyone needing to view or manipulate JSON data in a spreadsheet.',
    ],
  },
  {
    name: 'Webhook Tester',
    slug: 'webhook-tester',
    category: 'Developer',
    icon: 'Webhook',
    description:
      'Creates instant URLs to test webhooks and inspect incoming data.',
    longDescription:
      'Developing and debugging webhooks has never been easier. The Webhook Tester instantly generates a unique, temporary URL that you can use to receive webhook requests from any service (like Stripe, GitHub, or your own application). All incoming requests sent to this URL are captured and displayed in real-time, allowing you to inspect the headers, payload, and other details. It\'s an indispensable tool for ensuring your webhook integrations are working correctly.',
    features: [
      'Generates a unique, disposable URL',
      'Inspects incoming webhook headers and payloads in real-time',
      'Supports GET, POST, PUT, and other HTTP methods',
      'No registration required, just generate and use',
    ],
    howItWorks: [
      'A unique URL is automatically generated for you.',
      'Use this URL as the endpoint for your webhook service.',
      'As requests come in, they appear instantly on the page.',
      'Click on any request to inspect its full details.',
    ],
    useCases: [
      'Developers building integrations with third-party services.',
      'QA engineers testing webhook functionality.',
      'System administrators debugging webhook delivery issues.',
    ],
  },
  {
    name: 'Daily Calorie & Macro Calculator',
    slug: 'daily-calorie-macro-calculator',
    category: 'Health',
    icon: 'HeartPulse',
    description:
      'Calculates daily calories, proteins, carbs, and fats based on TDEE and user fitness goals.',
    longDescription:
      'Take control of your nutrition with our Daily Calorie & Macro Calculator. Based on your age, gender, weight, height, activity level, and fitness goals (like losing weight, gaining muscle, or maintaining), this tool calculates your Total Daily Energy Expenditure (TDEE). It then provides a personalized recommendation for your daily calorie intake, broken down into macronutrients: proteins, carbohydrates, and fats. This scientific approach helps you build a diet plan that is tailored to your body and objectives.',
    features: [
      'Calculates TDEE using Mifflin-St Jeor formula',
      'Personalized goals: weight loss, maintenance, or muscle gain',
      'Provides a detailed macronutrient breakdown',
      'Adjusts recommendations based on activity level',
    ],
    howItWorks: [
      'Enter your personal details (age, gender, height, weight).',
      'Select your weekly activity level and primary fitness goal.',
      'The tool calculates your TDEE and daily targets.',
      'Use these numbers to guide your daily food choices.',
    ],
    useCases: [
      'Individuals aiming for weight loss or muscle gain.',
      'Fitness enthusiasts optimizing their nutrition plan.',
      'Anyone curious about their daily caloric needs.',
    ],
  },
  {
    name: 'Sleep Score Analyzer',
    slug: 'sleep-score-analyzer',
    category: 'Health',
    icon: 'BedDouble',
    description:
      'Analyzes sleep cycle data (CSV/JSON) to show REM, deep sleep, HRV, and sleep quality insights.',
    longDescription:
      'Unlock the secrets of your sleep. The Sleep Score Analyzer takes your raw sleep data from wearables like Oura, Whoop, or Apple Watch and transforms it into meaningful insights. Upload your data file (in CSV or JSON format), and the tool will analyze your sleep stages (REM, deep, light), Heart Rate Variability (HRV), and other key metrics. It generates a comprehensive sleep quality score and provides personalized recommendations to help you improve your sleep hygiene and overall recovery.',
    features: [
      'Parses sleep data from CSV or JSON files',
      'Analyzes sleep stages and duration',
      'Calculates a comprehensive sleep quality score',
      'Visualizes trends in your sleep patterns over time',
    ],
    howItWorks: [
      'Export your sleep data from your wearable device\'s app.',
      'Upload the data file to the analyzer.',
      'The tool processes the data and generates your sleep report.',
      'Review your sleep score, cycle analysis, and insights.',
    ],
    useCases: [
      'Biohackers looking to optimize their sleep and recovery.',
      'Athletes tracking their readiness to perform.',
      'Anyone wanting to better understand and improve their sleep.',
    ],
  },
  {
    name: 'AI Habit Tracker',
    slug: 'ai-habit-tracker',
    category: 'Health',
    icon: 'Target',
    description:
      'Smart habit planner with AI-generated suggestions, streak reminders, and progress insights.',
    longDescription:
      "Build better habits that stick with the AI Habit Tracker. This isn't just a simple checklist; it's a smart planner that helps you achieve your goals. Our AI can suggest new habits based on your personal development goals. The tracker helps you maintain your streaks with intelligent reminders and visualizes your progress with insightful charts. Stay motivated, build consistency, and make lasting changes in your life with a habit tracker that works for you.",
    features: [
      'AI-powered habit suggestions',
      'Track daily, weekly, and monthly habits',
      'Maintain streaks and view progress charts',
      'Smart, customizable reminders',
    ],
    howItWorks: [
      'Set your personal growth goals.',
      'Choose from AI suggestions or create your own habits.',
      'Check in daily to mark your habits as complete.',
      'Review your progress and stay motivated with your streaks.',
    ],
    useCases: [
      'Individuals trying to build a new positive habit.',
      'People looking to break a bad habit.',
      'Anyone focused on personal development and self-improvement.',
    ],
  },
  {
    name: 'SaaS Pricing Optimizer',
    slug: 'saas-pricing-optimizer',
    category: 'Business',
    icon: 'BadgeDollarSign',
    description:
      'Recommends pricing tiers, psychological pricing, and revenue-optimized structures for SaaS products.',
    longDescription:
      'Pricing is one of the most critical decisions for any SaaS business. The SaaS Pricing Optimizer uses data-driven models to help you find the sweet spot. Based on your target audience, product features, and competitive landscape, our AI recommends optimal pricing tiers and structures. It incorporates psychological pricing principles (like the decoy effect and price anchoring) to maximize revenue and customer adoption. Stop guessing and start making informed pricing decisions.',
    features: [
      'Recommends number and structure of pricing tiers',
      'Applies psychological pricing strategies',
      'Analyzes feature distribution across tiers',
      'Compares your pricing against industry benchmarks',
    ],
    howItWorks: [
      'Input information about your SaaS product and target market.',
      'Define the key features of your product.',
      'The AI analyzes the data and generates several pricing model recommendations.',
      'Choose and test the model that best fits your business.',
    ],
    useCases: [
      'SaaS startups defining their initial pricing strategy.',
      'Established companies looking to optimize their current pricing.',
      'Product managers trying to package features into tiers.',
    ],
  },
  {
    name: 'Churn Prediction Calculator',
    slug: 'churn-prediction-calculator',
    category: 'Business',
    icon: 'TrendingDown',
    description:
      'Predicts churn risk based on user activity trends, subscription history, and engagement features.',
    longDescription:
      'Proactively reduce customer churn by identifying at-risk users before they leave. The Churn Prediction Calculator uses a machine learning model to analyze your user data. By inputting metrics like user activity, subscription history, support ticket frequency, and engagement levels, the tool calculates a churn risk score for each user. This allows your customer success team to intervene with targeted retention campaigns and improve overall customer lifetime value.',
    features: [
      'Calculates a churn risk score for each user',
      'Identifies key factors contributing to churn',
      'Allows you to upload user data via CSV',
      'Helps prioritize retention efforts',
    ],
    howItWorks: [
      'Export and upload your user engagement and subscription data.',
      'The model analyzes the data to identify patterns of at-risk users.',
      'It assigns a churn probability score to each user.',
      'View a dashboard of your most at-risk segments and take action.',
    ],
    useCases: [
      'SaaS companies aiming to reduce monthly churn.',
      'Subscription-based businesses wanting to improve customer retention.',
      'Customer success teams looking to proactively engage users.',
    ],
  },
  {
    name: 'Salary Benchmark Tool',
    slug: 'salary-benchmark-tool',
    category: 'Business',
    icon: 'Briefcase',
    description:
      'Shows salary ranges globally by job role, experience, and skill category.',
    longDescription:
      'Whether you are a hiring manager, a job seeker, or negotiating a raise, our Salary Benchmark Tool provides the data you need. It aggregates salary data from thousands of sources to show you realistic salary ranges for various job roles across the globe. You can filter by experience level, industry, and specific skill sets to get a highly accurate benchmark. Make sure you are paying or earning a fair market rate with up-to-date salary information.',
    features: [
      'Global salary data for thousands of job roles',
      'Filter by location, experience level, and industry',
      'Benchmark against specific skills and technologies',
      'Data updated regularly to reflect market trends',
    ],
    howItWorks: [
      'Enter the job title and location you are interested in.',
      'Add filters for years of experience and industry.',
      'The tool displays a salary range (e.g., 25th to 75th percentile).',
      'View related salary data for similar roles or skills.',
    ],
    useCases: [
      'HR managers setting salary bands for new positions.',
      'Employees preparing for a salary negotiation.',
      'Job seekers evaluating the salary of a potential offer.',
    ],
  },
  {
    name: 'AI Contract Summarizer',
    slug: 'ai-contract-summarizer',
    category: 'Business',
    icon: 'FileSearch',
    description:
      'Summarizes legal contracts into simple bullet points with key terms, obligations, and risk areas.',
    longDescription:
      'Legal contracts can be long, dense, and difficult to understand. The AI Contract Summarizer uses natural language processing to read and analyze legal documents. It extracts and presents the most critical information in a simple, easy-to-digest format. Get a quick overview of key terms, dates, party obligations, and potential risk areas without having to read the entire document. This tool is a powerful assistant for anyone who deals with contracts but is not a lawyer.',
    features: [
      'Summarizes long legal documents into bullet points',
      'Identifies key terms, dates, and obligations',
      'Highlights potential risks and non-standard clauses',
      'Supports PDF, DOCX, and text file uploads',
    ],
    howItWorks: [
      'Upload your contract file or paste the text.',
      'The AI reads and analyzes the document.',
      'It generates a concise summary highlighting the most important points.',
      'Review the summary for a quick understanding of the contract.',
    ],
    useCases: [
      'Business owners quickly reviewing vendor agreements.',
      'Freelancers understanding the terms of a client contract.',
      'Anyone wanting to grasp the essence of a legal document quickly.',
    ],
  },
  {
    name: 'Invoice → Excel Extractor',
    slug: 'invoice-excel-extractor',
    category: 'Business',
    icon: 'Table',
    description:
      'Extracts line items, totals, taxes, vendor data, and invoice numbers into Excel format.',
    longDescription:
      'Manual data entry from invoices is tedious and error-prone. Our Invoice to Excel Extractor automates this process. Upload one or more invoices in PDF or image format, and our AI will use Optical Character Recognition (OCR) and document understanding to extract key information. It captures line items, quantities, prices, totals, taxes, vendor details, and invoice numbers, then organizes it all into a clean, structured Excel spreadsheet. Save hours of work and improve accuracy.',
    features: [
      'Uses AI-powered OCR to extract data from invoices',
      'Handles multiple invoice formats and layouts',
      'Extracts line items, totals, taxes, and more',
      'Exports data to a structured Excel (XLSX) file',
    ],
    howItWorks: [
      'Upload your invoice files (PDF, JPG, PNG).',
      'Our AI scans the documents and extracts the relevant data fields.',
      'Review the extracted data for accuracy.',
      'Download the final, structured data as an Excel spreadsheet.',
    ],
    useCases: [
      'Accountants automating data entry for bookkeeping.',
      'Businesses processing large volumes of supplier invoices.',
      'Anyone needing to extract tabular data from documents.',
    ],
  },
];
