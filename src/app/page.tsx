
import { tools } from '@/lib/tools';
import { HomePageClient } from '@/components/homepage/home-page-client';
import { placeholderImages } from '@/lib/placeholder-images';

export default function Home() {
  const toolsWithImages = tools.map((tool) => {
    const image = placeholderImages.find((img) => img.id === tool.slug);
    // Don't pass the icon component to the client
    const { ...toolWithoutIcon } = tool;
    return {
      ...toolWithoutIcon,
      icon: tool.icon,
      image: image?.imageUrl || `https://picsum.photos/seed/${tool.slug}/300/300`,
      width: 300,
      height: 300,
      imageHint: image?.imageHint || 'tool illustration',
    };
  });

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    url: 'https://all2ools.com/',
    name: 'All2ools',
    description:
      'The ultimate suite of 30+ free online tools powered by AI. Explore tools for finance, SEO, image editing, business management, developers, and more.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://all2ools.com/?search={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'All2ools',
    url: 'https://all2ools.com/',
    logo: 'https://all2ools.com/logo.png', // Assuming you have a logo here
    sameAs: [],
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Is All2ools free to use?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, all tools available on All2ools are completely free to use. There are no hidden charges, subscription fees, or usage limits.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do I need to create an account?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No, you do not need to create an account to use our tools. All utilities are accessible instantly without any signup required.',
        },
      },
      {
        '@type': 'Question',
        name: 'Are my uploaded files and data secure?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, your privacy and security are our top priorities. Most of our tools process data directly in your browser. For tools that require server-side processing, we do not store your files or data permanently. All uploads are deleted automatically after processing.',
        },
      },
      {
        '@type': 'Question',
        name: 'How many tools does All2ools offer?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'All2ools offers a growing suite of over 25 essential tools across various categories, including SEO, Business, Finance, Image, PDF, and Developer utilities. We are constantly adding new tools every month.',
        },
      },
    ],
  };
  
  const featuredTools = [
    'pdf-to-word-converter', 'image-compressor', 'regex-generator-from-text', 
    '1-click-article-outline-generator', 'json-excel-converter', 'api-latency-checker'
  ];

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Featured Tools on All2ools',
    itemListElement: tools
      .filter(t => featuredTools.includes(t.slug))
      .map((tool, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'SoftwareApplication',
        name: tool.name,
        url: `https://all2ools.com/tools/${tool.slug}`,
        applicationCategory: 'Utility',
        operatingSystem: 'Any',
        description: tool.description,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
       <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <HomePageClient tools={toolsWithImages} />
    </>
  );
}
