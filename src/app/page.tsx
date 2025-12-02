
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
      image: image?.imageUrl || `https://picsum.photos/seed/${tool.slug}/500/300`,
      width: 500,
      height: 300,
      imageHint: image?.imageHint || 'tool illustration',
    };
  });

  return <HomePageClient tools={toolsWithImages} />;
}
