import { useLanguage } from '@/hooks/use-language';
import { Construction } from 'lucide-react';

export function PlaceholderTool() {
  const { translate } = useLanguage();

  return (
    <div className="flex flex-col items-center justify-center text-center p-8 bg-muted rounded-lg h-64">
      <Construction className="h-12 w-12 text-primary mb-4" />
      <h3 className="text-xl font-semibold mb-2">{translate('tool_coming_soon')}</h3>
      <p className="text-muted-foreground max-w-sm">
        {translate('tool_placeholder_desc')}
      </p>
    </div>
  );
}
